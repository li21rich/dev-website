import React, { useRef, useEffect } from "react";

interface NodeBackgroundProps {
  nodeCount?: number;
  edgeDistance?: number;
  cursorEdgeDistance?: number;
  gravityStrength?: number;
  nodeColor?: string;
  edgeColor?: string;
  cursorEdgeColor?: string;
  fullScreen?: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ReactiveNodeBackground: React.FC<NodeBackgroundProps> = ({
  nodeCount = 720,
  cursorEdgeDistance = 200,
  gravityStrength = 0.25,
  nodeColor = "#FF6F00",
  edgeColor = "rgba(255,111,0,0.2)",
  cursorEdgeColor = "rgba(255,111,0,0.5)",
  fullScreen = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Initialize nodes
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = fullScreen ? window.innerWidth : canvas.parentElement!.clientWidth;
      canvas.height = fullScreen ? window.innerHeight : canvas.parentElement!.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cursor = cursorRef.current;


      // Draw edges from cursor to nearby nodes
      if (cursor) {
        nodesRef.current.forEach((n) => {
          const dist = Math.hypot(n.x - cursor.x, n.y - cursor.y);
          if (dist < cursorEdgeDistance) {
            const opacity = 1 - (dist / cursorEdgeDistance);
            ctx.strokeStyle = cursorEdgeColor.replace(/[\d.]+\)$/, `${opacity * 0.5})`);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cursor.x, cursor.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        });
      }
// Update nodes with gravitational pull toward cursor
      nodesRef.current.forEach((n) => {
        // Apply gravity toward cursor if cursor is on screen
        if (cursor) {
          const dx = cursor.x - n.x;
          const dy = cursor.y - n.y;
          const dist = Math.hypot(dx, dy);
          const minDist = 66; // Ground distance - nodes can't get closer than this
          
          if (dist < minDist) {
            // Push nodes away if they're within the minimum distance
            const repelForce = (minDist - dist) * 0.006;
            n.vx -= (dx / dist) * repelForce;
            n.vy -= (dy / dist) * repelForce;
          } else if (dist < cursorEdgeDistance) {
            // Apply gravity if farther than minimum distance
            const force = (gravityStrength * (1 - dist / cursorEdgeDistance)) / dist;
            n.vx += dx * force;
            n.vy += dy * force;
          }
        }

        // Apply velocity damping to prevent runaway speeds
        n.vx *= 0.95;
        n.vy *= 0.95;

        n.x += n.vx;
        n.y += n.vy;

        // Keep nodes within bounds
        n.x = Math.max(0, Math.min(canvas.width, n.x));
        n.y = Math.max(0, Math.min(canvas.height, n.y));

        // Bounce off edges
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Draw node
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodeCount, cursorEdgeDistance, gravityStrength, edgeColor, nodeColor, cursorEdgeColor, fullScreen]);

  // Cursor tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: fullScreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: fullScreen ? 1 : undefined,
        pointerEvents: "none",
      }}
    />
  );
};

export default ReactiveNodeBackground;