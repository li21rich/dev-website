import React, { useRef, useState, useEffect } from "react";

interface Panel {
  image: string;
  link: string;
}

interface PanelCarouselProps {
  panels: Panel[];
  radius?: number;
  panelWidth?: number;
  panelHeight?: number;
  className?: string;
}

const DRAG_THRESHOLD = 5;

const PanelCarousel: React.FC<PanelCarouselProps> = ({
  panels,
  radius = 300,
  panelWidth = 280,
  panelHeight = 280,
  className = "",
}) => {
  const [rotationY, setRotationY] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const startX = useRef(0);
  const lastX = useRef(0);
  const currentRotation = useRef(0);
  const mouseIsDown = useRef(false);
  const didSpin = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Drag Handling ---
  const onMouseDown = (e: React.MouseEvent) => {
    // This event bubbles up from either the Background Layer OR a Panel
    startX.current = e.clientX;
    lastX.current = e.clientX;
    didSpin.current = false;
    mouseIsDown.current = true;
  };

  const onMouseMoveGlobal = (e: MouseEvent) => {
    // 1. Tilt (Always active)
    if (!isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const offsetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setTiltY(offsetX * 17);
      setTiltX(-offsetY * 17);
    }

    if (!mouseIsDown.current) return;

    // 2. Detect Drag Start
    const dx = e.clientX - startX.current;
    if (!isDragging && Math.abs(dx) >= DRAG_THRESHOLD) {
      setIsDragging(true);
      setHoveredIndex(null); // Kill hover immediately
    }

    // 3. Perform Rotation
    if (isDragging) {
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      const newRot = currentRotation.current + deltaX * 0.3;
      currentRotation.current = newRot;
      setRotationY(newRot);
      didSpin.current = true;
    }
  };

  const onMouseUpGlobal = () => {
    setIsDragging(false);
    mouseIsDown.current = false;
    currentRotation.current = rotationY;
  };

  const onWheel = (e: WheelEvent) => {
    if (!containerRef.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 1) return;
    e.preventDefault();
    const newRot = currentRotation.current + delta * -0.15;
    currentRotation.current = newRot;
    setRotationY(newRot);
    didSpin.current = true;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveGlobal);
    window.addEventListener("mouseup", onMouseUpGlobal);
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove", onMouseMoveGlobal);
      window.removeEventListener("mouseup", onMouseUpGlobal);
      if (el) el.removeEventListener("wheel", onWheel);
    };
  }, [isDragging, rotationY]);

  // --- Click / Hover ---
  const handlePanelClick = (e: React.MouseEvent, link: string) => {
    if (didSpin.current) {
      e.preventDefault();
      return;
    }
    console.log("Navigating to:", link);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      // Bubbling Point: Captures mousedown from the BackLayer OR the Panels
      onMouseDown={onMouseDown} 
      onDragStart={(e) => e.preventDefault()}
      style={{
        width: "100%",
        height: `${panelHeight + 100}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
        overflow: "visible",
        cursor: isDragging ? "grabbing" : "grab",
        // CRITICAL FIX: The container itself ignores mouse events.
        // This prevents the "glass window" effect blocking backfaces.
        pointerEvents: "none", 
      }}
    >
      {/* 
        LAYER 1: The Drag Surface
        This fills the empty space. It catches clicks where there are no panels.
        It sits at z-index 0.
      */}
      <div 
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "auto", // Can be clicked/dragged
        }}
      />

      {/* 
        LAYER 2: The 3D Scene
        This sits on top (z-index 10).
      */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${tiltX}deg) rotateY(${rotationY + tiltY}deg)`,
          transition: isDragging ? "none" : "transform 0.5s ease-out",
          zIndex: 10,
          pointerEvents: "none", // Ensure the transformation layer doesn't block rays
        }}
      >
        {panels.map((panel, index) => {
          const angle = (360 / panels.length) * index;
          const isHovered = hoveredIndex === index;

          return (
            <a
              key={index}
              href={panel.link}
              onClick={(e) => handlePanelClick(e, panel.link)}
              onMouseEnter={() => !isDragging && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              draggable={false}
              style={{
                position: "absolute",
                width: panelWidth,
                height: panelHeight,
                left: "50%",
                top: "50%",
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                borderRadius: 10,
                display: "block",
                backfaceVisibility: "visible",
                cursor: "pointer",
                transition: "box-shadow 0.2s ease",
                // CRITICAL FIX: Panels are the ONLY thing in the 3D layer that accept events.
                // This ensures "rays" pass through everything else to hit them.
                pointerEvents: "auto", 
                backgroundColor: "rgba(255,255,255,0.01)" // Ensures hit-area solidity
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${panel.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 10,
                  pointerEvents: "none",
                  opacity: isHovered ? 1 : 0.85,
                  transition: "opacity 0.2s ease",
                }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default PanelCarousel;