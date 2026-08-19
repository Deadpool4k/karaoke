"use client";

import { useEffect, useRef } from "react";

export default function LyricsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      speed: 0.0002 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      const grad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.6
      );
      grad.addColorStop(0, "rgba(80, 0, 80, 0.08)");
      grad.addColorStop(0.5, "rgba(20, 0, 40, 0.04)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -0.05) p.y = 1.05;
        const alpha = 0.15 + Math.sin(frame * 0.02 + p.phase) * 0.08;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 100, 220, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
