'use client';

import { useEffect, useRef } from 'react';

export type CanvasEffectType = 'plexus' | 'matrix' | 'starfall' | 'bubbles';

interface ContactCanvasBgProps {
    effect?: CanvasEffectType;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

interface StarfallItem {
    x: number;
    y: number;
    speed: number;
    length: number;
    width: number;
    alpha: number;
    angle: number;
    color: string;
}

interface BubbleItem {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
    pulse: number;
    pulseSpeed: number;
    color: string;
}

export const ContactCanvasBg = ({ effect = 'plexus' }: ContactCanvasBgProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const mouse = { x: -1000, y: -1000, active: false };

        // --- PLEXUS STATE ---
        let particles: Particle[] = [];
        const plexusColors = [
            'rgba(255, 107, 53, 0.09)',  // Orange glow
            'rgba(70, 130, 180, 0.08)',   // Blue glow
            'rgba(255, 183, 3, 0.12)',   // Amber glow
        ];

        // --- MATRIX STATE ---
        const fontSize = 14;
        let columns = 0;
        let drops: number[] = [];
        let colColors: string[] = [];
        const charsList = '010101PRAKASHTRAVELSBOOKINGSAYALGUDITRIPCARVEHICLE'.split('');

        // --- STARFALL STATE ---
        let starfalls: StarfallItem[] = [];
        const starColors = [
            'rgba(255, 107, 53, ',  // orange
            'rgba(70, 130, 180, ',  // blue
            'rgba(255, 183, 3, ',   // amber
        ];

        // --- BUBBLES STATE ---
        let bubbles: BubbleItem[] = [];

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            width = rect?.width || window.innerWidth;
            height = rect?.height || 600;
            canvas.width = width;
            canvas.height = height;

            initEffect();
        };

        const initEffect = () => {
            if (effect === 'plexus') {
                particles = [];
                const count = Math.min(Math.floor(width / 18), 55);
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.45,
                        vy: (Math.random() - 0.5) * 0.45,
                        radius: Math.random() * 2.5 + 1.5,
                        color: plexusColors[Math.floor(Math.random() * plexusColors.length)],
                    });
                }
            } else if (effect === 'matrix') {
                columns = Math.floor(width / fontSize) + 1;
                drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -60));
                colColors = Array.from({ length: columns }, () =>
                    Math.random() > 0.5 ? 'rgba(255, 107, 53, ' : 'rgba(70, 130, 180, '
                );
            } else if (effect === 'starfall') {
                starfalls = [];
                const count = Math.min(Math.floor(width / 60), 30);
                for (let i = 0; i < count; i++) {
                    starfalls.push(createStarfallItem(Math.random() * height));
                }
            } else if (effect === 'bubbles') {
                bubbles = [];
                const count = Math.min(Math.floor(width / 45), 25);
                for (let i = 0; i < count; i++) {
                    bubbles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                        radius: Math.random() * 20 + 8,
                        alpha: Math.random() * 0.05 + 0.02,
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: Math.random() * 0.02 + 0.005,
                        color: Math.random() > 0.5 ? '255, 107, 53' : '70, 130, 180',
                    });
                }
            }
        };

        const createStarfallItem = (startY = -100): StarfallItem => {
            return {
                x: Math.random() * (width + 200),
                y: startY,
                speed: Math.random() * 3 + 2,
                length: Math.random() * 70 + 40,
                width: Math.random() * 1.5 + 0.8,
                alpha: Math.random() * 0.18 + 0.04,
                angle: Math.PI / 4 * 1.1, // diagonal slope
                color: starColors[Math.floor(Math.random() * starColors.length)],
            };
        };

        const draw = () => {
            if (effect === 'matrix') {
                // Fade matrix codes by layering a soft semi-transparent white screen overlay
                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.clearRect(0, 0, width, height);
            }

            if (effect === 'plexus') {
                // Draw Plexus Particles
                particles.forEach((p) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;
                    if (p.y < -10) p.y = height + 10;
                    if (p.y > height + 10) p.y = -10;

                    if (mouse.active) {
                        const dx = mouse.x - p.x;
                        const dy = mouse.y - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 140) {
                            const force = (140 - dist) / 140;
                            p.x -= (dx / dist) * force * 0.4;
                            p.y -= (dy / dist) * force * 0.4;
                        }
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                });

                // Draw Connections
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p1 = particles[i];
                        const p2 = particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 135) {
                            const alpha = (135 - dist) / 135 * 0.1;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(70, 130, 180, ${alpha})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            } else if (effect === 'matrix') {
                ctx.font = `bold ${fontSize}px sans-serif`;

                for (let i = 0; i < drops.length; i++) {
                    const char = charsList[Math.floor(Math.random() * charsList.length)];
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    if (y > 0 && y < height + 50) {
                        let alpha = 0.09;
                        let isNearMouse = false;

                        if (mouse.active) {
                            const dx = mouse.x - x;
                            const dy = mouse.y - y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 110) {
                                isNearMouse = true;
                                alpha = (110 - dist) / 110 * 0.4; // Light up under mouse
                            }
                        }

                        ctx.fillStyle = isNearMouse ? `rgba(255, 107, 53, ${alpha})` : `${colColors[i]}${alpha})`;
                        ctx.fillText(char, x, y);
                    }

                    if (y > height && Math.random() > 0.982) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            } else if (effect === 'starfall') {
                // Update and draw starfall comets
                starfalls.forEach((p) => {
                    const dx = Math.cos(p.angle) * p.speed;
                    const dy = Math.sin(p.angle) * p.speed;
                    p.x -= dx;
                    p.y += dy;

                    if (p.y > height + 80 || p.x < -80) {
                        Object.assign(p, createStarfallItem(-40));
                    }

                    const grad = ctx.createLinearGradient(
                        p.x, p.y, 
                        p.x + Math.cos(p.angle) * p.length, 
                        p.y - Math.sin(p.angle) * p.length
                    );
                    grad.addColorStop(0, `${p.color}${p.alpha})`);
                    grad.addColorStop(1, `${p.color}0)`);

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y - Math.sin(p.angle) * p.length);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = p.width;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                });

                // Interactive trails from cursor
                if (mouse.active && Math.random() < 0.25) {
                    starfalls.push({
                        x: mouse.x + (Math.random() - 0.5) * 20,
                        y: mouse.y + (Math.random() - 0.5) * 20,
                        speed: Math.random() * 4 + 3,
                        length: Math.random() * 40 + 20,
                        width: Math.random() * 1.5 + 1,
                        alpha: 0.35,
                        angle: Math.PI / 4 * 1.1,
                        color: 'rgba(255, 107, 53, ', // orange comets from mouse
                    });
                    if (starfalls.length > 70) {
                        starfalls.shift();
                    }
                }
            } else if (effect === 'bubbles') {
                bubbles.forEach((b) => {
                    b.x += b.vx;
                    b.y += b.vy;

                    // Bounce off walls
                    if (b.x < b.radius || b.x > width - b.radius) b.vx *= -1;
                    if (b.y < b.radius || b.y > height - b.radius) b.vy *= -1;

                    if (mouse.active) {
                        const dx = mouse.x - b.x;
                        const dy = mouse.y - b.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 140) {
                            const force = (140 - dist) / 140;
                            b.x -= (dx / dist) * force * 0.75;
                            b.y -= (dy / dist) * force * 0.75;
                        }
                    }

                    b.pulse += b.pulseSpeed;
                    const dynamicRadius = b.radius + Math.sin(b.pulse) * 2.5;
                    const dynamicAlpha = b.alpha + Math.sin(b.pulse) * 0.008;

                    // Radial glow gradient for bubbles
                    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, dynamicRadius);
                    grad.addColorStop(0, `rgba(${b.color}, ${dynamicAlpha})`);
                    grad.addColorStop(0.7, `rgba(${b.color}, ${dynamicAlpha * 0.2})`);
                    grad.addColorStop(1, `rgba(${b.color}, 0)`);

                    ctx.beginPath();
                    ctx.arc(b.x, b.y, dynamicRadius, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();

                    // Bubble border outline
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, dynamicRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${b.color}, ${dynamicAlpha * 0.55})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                });
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
        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('mouseleave', handleMouseLeave);
        }

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [effect]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none block z-0"
        />
    );
};
