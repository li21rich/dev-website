import React, { useRef, useEffect } from "react";

interface NodeBackgroundProps {
  nodeCount?: number;
  cursorEdgeDistance?: number;
  gravityStrength?: number;
  nodeColor?: string;
  cursorEdgeColor?: string;
  fullScreen?: boolean;
  layers?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return [255, 111, 0]; // fallback
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}


const ReactiveNodeBackground: React.FC<NodeBackgroundProps> = ({
  nodeCount = 950,
  cursorEdgeDistance = 200,
  gravityStrength = 0.25,
  nodeColor = "#FF6F00",
  cursorEdgeColor = "rgba(255,111,0,0.5)",
  layers = 5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // initialize nodes with random layers
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      layer: Math.floor(Math.random() * layers),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cursor = cursorRef.current;
      const scrollOffset = scrollYRef.current;

      // First update positions
      nodesRef.current.forEach((n) => {
        // Cursor gravity + minDist
        if (cursor) {
          const depthFactor = 0.1 + 0.15 * n.layer;
          const px = n.x;
          const py = n.y - scrollOffset * depthFactor;

          const dx = cursor.x - px;
          const dy = cursor.y - py;
          const dist = Math.hypot(dx, dy);
                    const minDist = 66;

                    if (dist < minDist) {
            const repel = (minDist - dist) * 0.006;
            n.vx -= (dx / dist) * repel;
            n.vy -= (dy / dist) * repel;
          } else if (dist < cursorEdgeDistance) {
            const force = (gravityStrength * (1 - dist / cursorEdgeDistance)) / dist;
            n.vx += dx * force;
            n.vy += dy * force;
          }

        }

        // update velocity with damping
        n.vx *= 0.95;
        n.vy *= 0.95;

        n.x += n.vx;
        n.y += n.vy;
      });

      // Draw nodes first
      nodesRef.current.forEach((n) => {
        const depthFactor = 0.1 + 0.15 * n.layer;
        const drawX = n.x;
        const drawY = n.y - scrollOffset * depthFactor;

        if (drawY < -50 || drawY > canvas.height + 50) return;
        
        const [r, g, b] = hexToRgb(nodeColor);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.6 + 0.4 * (n.layer / (layers - 1))})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 0.94, 0, Math.PI * 2);
        ctx.fill();
      });
      // Draw edges after nodes
      if (cursor) {
        nodesRef.current.forEach((n) => {
          const depthFactor = 0.1 + 0.15 * n.layer;
          const px = n.x;
          const py = n.y - scrollOffset * depthFactor;

          const dx = cursor.x - px;
          const dy = cursor.y - py;
          const dist = Math.hypot(dx, dy);

          if (dist < cursorEdgeDistance) {
            const opacity = 1 - dist / cursorEdgeDistance;
            ctx.strokeStyle = cursorEdgeColor.replace(
              /[\d.]+\)$/,
              `${opacity * 0.5})`
            );
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cursor.x, cursor.y);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        });
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodeCount, cursorEdgeDistance, gravityStrength, nodeColor, cursorEdgeColor, layers]);

  // track cursor
  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  // track scroll
  useEffect(() => {
    const scroll = () => (scrollYRef.current = window.scrollY);
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ReactiveNodeBackground;
