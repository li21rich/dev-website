import React, { useRef, useState, useEffect } from "react";

interface PanelCarouselProps {
  panels: string[];
  radius?: number;
  panelWidth?: number;
  panelHeight?: number;
}

const PanelCarousel: React.FC<PanelCarouselProps> = ({
  panels,
  radius = 300,
  panelWidth = 200,
  panelHeight = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    setRotationY(currentRotation.current + deltaX * 0.3);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    currentRotation.current = rotationY;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, rotationY]);

  const onContainerMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { height } = containerRef.current.getBoundingClientRect();
    const offsetY = (e.clientY - height / 2) / height;
    containerRef.current.style.transform = `perspective(1000px) rotateY(${rotationY}deg) rotateX(${-offsetY * 10}deg)`;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onContainerMouseMove}
      style={{
        width: "100%",
        height: `${panelHeight + 100}px`, // adjust to fit panels
        position: "relative",
        transformStyle: "preserve-3d",
        transition: isDragging ? "none" : "transform 0.5s",
        cursor: isDragging ? "grabbing" : "grab",
        overflow: "visible",
        zIndex: 1, // can be increased if needed
      }}
    >
      {panels.map((src, index) => {
        const angle = (360 / panels.length) * index;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: panelWidth,
              height: panelHeight,
              left: "50%",
              top: "50%",
              transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 10,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            }}
          />
        );
      })}
    </div>
  );
};

export default PanelCarousel;
