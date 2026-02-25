"use client";
import { useEffect, useRef } from "react";

export function SuccessConfetti() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: any[] = [];
        const colors = ["#fbbf24", "#f59e0b", "#d97706", "#10b981", "#3b82f6", "#ec4899"];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.y += p.vy;
                p.x += p.vx;
                p.rotation += 2;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            requestAnimationFrame(animate);
        }

        const animId = requestAnimationFrame(animate);

        // Auto stop after 5 seconds to match "Success" vibe
        const timeout = setTimeout(() => {
            // Logic to stop/fade out could go here
        }, 5000);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
        />
    );
}
