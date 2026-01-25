import React, { useEffect, useRef } from "react";

interface BrusherProps {
  image: string;
  brushSize?: number;
  brushBlur?: number;
  keepCleared?: boolean;
  fullScreen?: boolean; // new prop to toggle full-page mode
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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const trailSteps = useRef<{ x: number; y: number; time: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  const getMousePos = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawTail = () => {
    if (!drawCanvasRef.current || !brushCanvasRef.current || !imageRef.current)
      return;

    const drawCtx = drawCanvasRef.current.getContext("2d")!;
    const brushCtx = brushCanvasRef.current.getContext("2d")!;

    const now = Date.now();
    trailSteps.current = trailSteps.current.filter(
      (s) => now - s.time <= (keepCleared ? 120 : 690)
    );

    if (!keepCleared) {
      brushCtx.clearRect(0, 0, brushCanvasRef.current.width, brushCanvasRef.current.height);
    }

    brushCtx.strokeStyle = "rgba(0,0,0,0.25)";
    brushCtx.lineWidth = brushSize;
    brushCtx.lineCap = "round";
    brushCtx.shadowBlur = brushBlur;
    brushCtx.shadowColor = "#000";

    for (let i = 1; i < trailSteps.current.length; i++) {
      brushCtx.beginPath();
      brushCtx.moveTo(trailSteps.current[i - 1].x, trailSteps.current[i - 1].y);
      brushCtx.lineTo(trailSteps.current[i].x, trailSteps.current[i].y);
      brushCtx.stroke();
    }

    let drawWidth = drawCanvasRef.current.width;
    let drawHeight =
      (drawCanvasRef.current.width / imageRef.current.naturalWidth) *
      imageRef.current.naturalHeight;

    if (drawHeight < drawCanvasRef.current.height) {
      drawHeight = drawCanvasRef.current.height;
      drawWidth =
        (drawCanvasRef.current.height / imageRef.current.naturalHeight) *
        imageRef.current.naturalWidth;
    }

    drawCtx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    drawCtx.drawImage(imageRef.current, 0, 0, drawWidth, drawHeight);
    drawCtx.globalCompositeOperation = "destination-in";
    drawCtx.drawImage(brushCanvasRef.current, 0, 0);
    drawCtx.globalCompositeOperation = "source-over";

    rafRef.current = requestAnimationFrame(drawTail);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const drawCanvas = document.createElement("canvas");
    const brushCanvas = document.createElement("canvas");

    drawCanvas.style.position = "absolute";
    brushCanvas.style.position = "absolute";
    drawCanvas.style.top = "0";
    drawCanvas.style.left = "0";
    brushCanvas.style.top = "0";
    brushCanvas.style.left = "0";

    drawCanvas.style.zIndex = "1";
    brushCanvas.style.zIndex = "1";

    const width = fullScreen ? window.innerWidth : containerRef.current.clientWidth;
    const height = fullScreen ? window.innerHeight : containerRef.current.clientHeight;

    drawCanvas.width = width;
    drawCanvas.height = height;
    brushCanvas.width = width;
    brushCanvas.height = height;

    containerRef.current.appendChild(drawCanvas);
    containerRef.current.appendChild(brushCanvas);

    drawCanvasRef.current = drawCanvas;
    brushCanvasRef.current = brushCanvas;

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
      if (drawCanvasRef.current && brushCanvasRef.current) {
        drawCanvasRef.current.width = fullScreen ? window.innerWidth : containerRef.current!.clientWidth;
        drawCanvasRef.current.height = fullScreen ? window.innerHeight : containerRef.current!.clientHeight;
        brushCanvasRef.current.width = drawCanvasRef.current.width;
        brushCanvasRef.current.height = drawCanvasRef.current.height;
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
        zIndex: fullScreen ? 0 : undefined,
        overflow: "hidden",
      }}
    />
  );
};

export default Brusher;
