import React, { useEffect, useRef } from "react";

interface BrusherProps {
  image: string;
  brushSize?: number;
  brushBlur?: number;
  keepCleared?: boolean;
  fullScreen?: boolean;
}

const Brusher: React.FC<BrusherProps> = ({
  image,
  brushSize = 80,
  brushBlur = 30,
  keepCleared = false,
  fullScreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const trailSteps = useRef<{ x: number; y: number; time: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  const getMousePos = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawTail = () => {
    if (!drawCanvasRef.current || !brushCanvasRef.current || !colorCanvasRef.current || !imageRef.current)
      return;

    const drawCtx = drawCanvasRef.current.getContext("2d")!;
    const brushCtx = brushCanvasRef.current.getContext("2d")!;
    const colorCtx = colorCanvasRef.current.getContext("2d")!;

    // Draw new brush strokes permanently
    brushCtx.strokeStyle = "rgba(255,255,255,1)";
    brushCtx.lineWidth = brushSize;
    brushCtx.lineCap = "round";
    brushCtx.shadowBlur = brushBlur;
    brushCtx.shadowColor = "#fff";

    // Only draw the newest segment
    if (trailSteps.current.length >= 2) {
      brushCtx.beginPath();
      brushCtx.moveTo(trailSteps.current[1].x, trailSteps.current[1].y);
      brushCtx.lineTo(trailSteps.current[0].x, trailSteps.current[0].y);
      brushCtx.stroke();
    }
    
    // Keep only recent trail for smooth drawing
    const now = Date.now();
    trailSteps.current = trailSteps.current.filter(
      (s) => now - s.time <= 100
    );

    // Calculate dimensions to cover the canvas (like background-size: cover)
    const canvasAspect = drawCanvasRef.current.width / drawCanvasRef.current.height;
    const imageAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    if (canvasAspect > imageAspect) {
      // Canvas is wider than image
      drawWidth = drawCanvasRef.current.width;
      drawHeight = drawWidth / imageAspect;
      offsetY = (drawCanvasRef.current.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image
      drawHeight = drawCanvasRef.current.height;
      drawWidth = drawHeight * imageAspect;
      offsetX = (drawCanvasRef.current.width - drawWidth) / 2;
    }

    // Draw grayscale base on main canvas
    drawCtx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    drawCtx.filter = "grayscale(100%)";
    drawCtx.drawImage(imageRef.current, offsetX, offsetY, drawWidth, drawHeight);
    drawCtx.filter = "none";
    
    // Draw color image on separate canvas
    colorCtx.clearRect(0, 0, colorCanvasRef.current.width, colorCanvasRef.current.height);
    colorCtx.drawImage(imageRef.current, offsetX, offsetY, drawWidth, drawHeight);
    
    // Mask color image with brush strokes
    colorCtx.globalCompositeOperation = "destination-in";
    colorCtx.drawImage(brushCanvasRef.current, 0, 0);
    colorCtx.globalCompositeOperation = "source-over";
    
    // Composite masked color over grayscale
    drawCtx.drawImage(colorCanvasRef.current, 0, 0);

    rafRef.current = requestAnimationFrame(drawTail);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const drawCanvas = document.createElement("canvas");
    const brushCanvas = document.createElement("canvas");
    const colorCanvas = document.createElement("canvas");

    drawCanvas.style.position = "absolute";
    drawCanvas.style.top = "0";
    drawCanvas.style.left = "0";
    drawCanvas.style.zIndex = "1";

    const width = fullScreen ? window.innerWidth : containerRef.current.clientWidth;
    const height = fullScreen ? window.innerHeight : containerRef.current.clientHeight;

    drawCanvas.width = width;
    drawCanvas.height = height;
    brushCanvas.width = width;
    brushCanvas.height = height;
    colorCanvas.width = width;
    colorCanvas.height = height;

    containerRef.current.appendChild(drawCanvas);

    drawCanvasRef.current = drawCanvas;
    brushCanvasRef.current = brushCanvas;
    colorCanvasRef.current = colorCanvas;

    const img = new Image();
    img.src = image;
    imageRef.current = img;
    img.onload = () => {
      drawTail();
    };

    const mouseHandler = (e: MouseEvent) => {
      if (!drawCanvasRef.current) return;
      const pos = getMousePos(e, drawCanvasRef.current);
      trailSteps.current.unshift({ ...pos, time: Date.now() });
    };

    document.addEventListener("mousemove", mouseHandler);

    const resizeHandler = () => {
      if (drawCanvasRef.current && brushCanvasRef.current && colorCanvasRef.current) {
        const w = fullScreen ? window.innerWidth : containerRef.current!.clientWidth;
        const h = fullScreen ? window.innerHeight : containerRef.current!.clientHeight;
        drawCanvasRef.current.width = w;
        drawCanvasRef.current.height = h;
        brushCanvasRef.current.width = w;
        brushCanvasRef.current.height = h;
        colorCanvasRef.current.width = w;
        colorCanvasRef.current.height = h;
      }
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      document.removeEventListener("mousemove", mouseHandler);
      window.removeEventListener("resize", resizeHandler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [image, brushBlur, brushSize, keepCleared, fullScreen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: fullScreen ? "fixed" : "relative",
        top: fullScreen ? 0 : undefined,
        left: fullScreen ? 0 : undefined,
        width: fullScreen ? "100vw" : "100%",
        height: fullScreen ? "100vh" : "100%",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    />
  );
};

export default Brusher;