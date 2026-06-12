'use client';
import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

export const BookingParticlesBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000, active: false };

        const colors = [
            'rgba(255, 107, 53, 0.45)',  // dynamic-orange
            'rgba(255, 183, 3, 0.45)',   // amber-accent
            'rgba(70, 130, 180, 0.4)',   // steel-blue
        ];

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            canvas.width = rect?.width || window.innerWidth;
            canvas.height = rect?.height || 600;
        };

        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor(canvas.width / 15), 90); // responsive count
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: (Math.random() - 0.5) * 0.7,
                    radius: Math.random() * 2.5 + 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update & Draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce at boundaries
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse interaction (gentle attraction/repulsion)
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        // Gently attract particles toward cursor
                        const force = (180 - dist) / 180;
                        p.x += (dx / dist) * force * 0.4;
                        p.y += (dy / dist) * force * 0.4;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            // Draw connection lines (constellation network)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (110 - dist) / 110 * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(70, 130, 180, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse
                if (mouse.active) {
                    const p = particles[i];
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const alpha = (150 - dist) / 150 * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 107, 53, ${alpha})`;
                        ctx.lineWidth = 1.0;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
        };

        window.addEventListener('resize', resize);
        canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
        canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

        resize();
        initParticles();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
            canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none block z-0"
        />
    );
};
