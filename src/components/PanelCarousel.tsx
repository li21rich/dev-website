import React, { useRef, useState, useEffect } from "react";

interface Panel {
  image: string;
  link: string;
  stack?: string[];
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
  radius = 315,
  panelWidth = 305 * 1.08,
  panelHeight = 200 * 1.08,
  className = "",
}) => {
  const [rotationY, setRotationY] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFlattened, setIsFlattened] = useState(false);

  const startX = useRef(0);
  const lastX = useRef(0);
  const currentRotation = useRef(0);
  const mouseIsDown = useRef(false);
  const didSpin = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Responsive sizing
  const baseRadius = isMobile ? Math.min(radius * 0.6, 200) : radius;
  const responsiveRadius = isFlattened ? baseRadius * .6 : baseRadius;
  const responsivePanelWidth = isMobile ? Math.min(panelWidth * 0.7, 220) : panelWidth;
  const responsivePanelHeight = isMobile ? Math.min(panelHeight * 0.7, 150) : panelHeight;

  // --- Mouse Drag Handling ---
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    lastX.current = e.clientX;
    didSpin.current = false;
    mouseIsDown.current = true;
  };

  const onMouseMoveGlobal = (e: MouseEvent) => {
    if (!isDragging && containerRef.current && !isMobile) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const offsetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setTiltY(offsetX * 17);
      setTiltX(-offsetY * 17);
    }

    if (!mouseIsDown.current) return;

    const dx = e.clientX - startX.current;
    if (!isDragging && Math.abs(dx) >= DRAG_THRESHOLD) {
      setIsDragging(true);
      setHoveredIndex(null);
    }

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

  // --- Touch Handling ---
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    lastX.current = touch.clientX;
    didSpin.current = false;
    mouseIsDown.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!mouseIsDown.current) return;
    const touch = e.touches[0];

    const dx = touch.clientX - startX.current;
    if (!isDragging && Math.abs(dx) >= DRAG_THRESHOLD) {
      setIsDragging(true);
      setHoveredIndex(null);
    }

    if (isDragging) {
      const deltaX = touch.clientX - lastX.current;
      lastX.current = touch.clientX;
      const newRot = currentRotation.current + deltaX * 0.3;
      currentRotation.current = newRot;
      setRotationY(newRot);
      didSpin.current = true;
    }
  };

  const onTouchEnd = () => {
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
  }, [isDragging, rotationY, isMobile]);

  // --- Click / Hover ---
  const handlePanelClick = (e: React.MouseEvent, link: string) => {
    if (didSpin.current) {
      e.preventDefault();
      return;
    }
    console.log("Navigating to:", link);
  };

  // --- Toggle Button Handler ---
  const toggleFlatten = () => {
    setIsFlattened(!isFlattened);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Toggle Switch */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "-190px" : "-170px",
          left: isMobile ? "105px" : "245px",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            fontSize: isMobile ? "13px" : "15px",
            fontWeight: "500",
            color: isFlattened ? "#666" : "#FF4A08",
            transition: "color 0.3s ease",
          }}
        >
          Carousel
        </span>
        <button
          onClick={toggleFlatten}
          style={{
            position: "relative",
            width: isMobile ? "48px" : "56px",
            height: isMobile ? "26px" : "30px",
            backgroundColor: isFlattened ? "#FF4A08" : "#ddd",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: isFlattened ? (isMobile ? "25px" : "29px") : "3px",
              width: isMobile ? "20px" : "24px",
              height: isMobile ? "20px" : "24px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "left 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        </button>
        <span
          style={{
            fontSize: isMobile ? "13px" : "15px",
            fontWeight: "500",
            color: isFlattened ? "#FF4A08" : "#666",
            transition: "color 0.3s ease",
          }}
        >
          Flipbook
        </span>
      </div>

      <div
        ref={containerRef}
        className={className}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: "100%",
          height: `${responsivePanelHeight + 100}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: isMobile ? "800px" : "1200px",
          overflow: "visible",
          cursor: isDragging ? "grabbing" : "grab",
          pointerEvents: "none",
          touchAction: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${rotationY + tiltY}deg)`,
            transition: isDragging ? "none" : "transform 0.5s ease-out",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {panels.map((panel, index) => {
            const angle = (360 / panels.length) * index;
            const isHovered = hoveredIndex === index;
            const panelRotation = isFlattened ? -90 : 0;

            return (
              <a
                key={index}
                href={panel.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handlePanelClick(e, panel.link)}
                onMouseEnter={() => !isDragging && !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                draggable={false}
                style={{
                  position: "absolute",
                  width: responsivePanelWidth,
                  height: responsivePanelHeight,
                  left: "50%",
                  top: "50%",
                  transformStyle: "preserve-3d",
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${responsiveRadius}px) rotateY(${panelRotation}deg)`,
                  borderRadius: isMobile ? 6 : 10,
                  display: "block",
                  backfaceVisibility: "visible",
                  cursor: "pointer",
                  transition: "transform 0.6s ease-in-out, box-shadow 0.2s ease",
                  pointerEvents: "auto",
                  backgroundColor: "rgba(255,255,255,0.01)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 74, 8, 0.6)",
                    backgroundImage: `url(${panel.image})`,
                    backgroundSize: isMobile ? "cover" : "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: isMobile ? "center" : "left",
                    display: "flex",
                    alignItems: "flex-start",
                    borderRadius: isMobile ? 6 : 10,
                    pointerEvents: "none",
                    opacity: isHovered ? 1 : 0.73,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {/* Tech Stack Icons */}
                  {panel.stack && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? "2px" : "4px",
                        zIndex: 2,
                        marginLeft: isMobile ? `${responsivePanelWidth - 34}px` : "296px",
                        marginTop: isMobile ? "4px" : "7px",
                      }}
                    >
                      {panel.stack.map((iconUrl, i) => (
                        <img
                          key={i}
                          src={iconUrl}
                          alt="tech-icon"
                          style={{
                            width: isMobile ? "18px" : "26px",
                            height: isMobile ? "18px" : "26px",
                            objectFit: "contain",
                            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PanelCarousel;