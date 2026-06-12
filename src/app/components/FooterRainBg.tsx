'use client';

import { useEffect, useRef } from 'react';

interface RainDrop {
    x: number;
    y: number;
    z: number; // Depth factor: 0.1 (far background) to 1.0 (close foreground)
    vx: number;
    vy: number;
    length: number;
    width: number;
    alpha: number;
}

interface WaterRipple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    speed: number;
    width: number; // Perspective line width
}

interface Point {
    x: number;
    y: number;
}

export const FooterRainBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const drops: RainDrop[] = [];
        const ripples: WaterRipple[] = [];
        
        const maxDrops = 100;
        const maxRipples = 60;

        // Lightning State variables
        let lightningOpacity = 0;
        let doubleFlashTriggered = false;
        let lightningBolt: Point[] | null = null;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            width = rect?.width || window.innerWidth;
            height = rect?.height || 300;
            canvas.width = width;
            canvas.height = height;
        };

        const createDrop = () => {
            const z = 0.15 + Math.random() * 0.85; // depth: 0.15 to 1.0
            return {
                x: Math.random() * width,
                y: Math.random() * -150 - 20,
                z: z,
                vx: (-0.6 - Math.random() * 1.2) * z, // Parallax lateral drift
                vy: (14 + Math.random() * 8) * z,    // Parallax fall speed
                length: (10 + Math.random() * 12) * z, // Parallax trail length
                width: (0.4 + Math.random() * 1.2) * z, // Parallax thickness
                alpha: (0.12 + Math.random() * 0.35) * z, // Parallax visibility
            };
        };

        const createRipple = (x: number, y: number, z: number, sizeMultiplier = 1.0) => {
            if (ripples.length >= maxRipples) {
                ripples.shift();
            }
            ripples.push({
                x,
                y,
                radius: 0.5,
                maxRadius: (10 + Math.random() * 15) * z * sizeMultiplier,
                alpha: 0.7 * z,
                speed: (0.25 + Math.random() * 0.35) * z,
                width: (0.4 + 0.8 * z) * sizeMultiplier,
            });
        };

        const generateLightningBolt = (): Point[] => {
            const points: Point[] = [];
            let startX = Math.random() * width;
            let startY = 0;
            points.push({ x: startX, y: startY });

            // Targets a landing plane height
            const targetY = height * 0.6 + Math.random() * height * 0.35;
            const segmentsCount = 10 + Math.floor(Math.random() * 5); // 10 to 14 segments
            const segmentHeight = targetY / segmentsCount;

            let currentX = startX;
            let currentY = startY;

            for (let i = 0; i < segmentsCount; i++) {
                currentY += segmentHeight;
                // Add horizontal zig-zag variation
                currentX += (Math.random() - 0.5) * (width * 0.05); 
                points.push({ x: currentX, y: currentY });
            }

            return points;
        };

        // Initialize rain drops across the volume
        for (let i = 0; i < maxDrops; i++) {
            drops.push(createDrop());
            drops[i].y = Math.random() * height;
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Draw and Update Raindrops
            drops.forEach((drop) => {
                // Update position
                drop.x += drop.vx;
                drop.y += drop.vy;

                // Draw raindrop streak
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + drop.vx * 0.4, drop.y + drop.length);
                ctx.strokeStyle = `rgba(70, 130, 180, ${drop.alpha})`;
                ctx.lineWidth = drop.width;
                ctx.stroke();

                // Perspective landing plane based on depth z
                const perspectiveFloor = height - (height * 0.28 * (1 - drop.z));
                
                if (drop.y >= perspectiveFloor || drop.x < -20) {
                    createRipple(drop.x, perspectiveFloor, drop.z);
                    
                    const reset = createDrop();
                    drop.x = reset.x;
                    drop.y = reset.y;
                    drop.z = reset.z;
                    drop.vx = reset.vx;
                    drop.vy = reset.vy;
                    drop.length = reset.length;
                    drop.width = reset.width;
                    drop.alpha = reset.alpha;
                }
            });

            // 2. Draw and Update Water Ripples
            ripples.forEach((ripple, index) => {
                ripple.radius += ripple.speed;
                ripple.alpha -= 0.012;

                if (ripple.alpha <= 0) {
                    ripples.splice(index, 1);
                    return;
                }

                ctx.beginPath();
                ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.28, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(70, 130, 180, ${ripple.alpha})`;
                ctx.lineWidth = ripple.width;
                ctx.stroke();
            });

            // 3. Lightning / Thunder Flash Trigger and Rendering
            // Randomly trigger lighting (about once every 6 seconds on average)
            if (Math.random() < 0.0025 && lightningOpacity <= 0) {
                lightningOpacity = 1.0;
                doubleFlashTriggered = false;
                lightningBolt = generateLightningBolt();
            }

            if (lightningOpacity > 0) {
                // Fade out flash
                lightningOpacity -= 0.038;

                // Double flash effect logic
                if (lightningOpacity <= 0 && !doubleFlashTriggered && Math.random() < 0.35) {
                    lightningOpacity = 0.75;
                    doubleFlashTriggered = true;
                    lightningBolt = generateLightningBolt();
                }

                // Draw full-canvas ambient lightning glow
                ctx.fillStyle = `rgba(224, 242, 254, ${lightningOpacity * 0.15})`;
                ctx.fillRect(0, 0, width, height);

                // Draw Jagged Lightning Bolt
                if (lightningBolt && lightningOpacity > 0.15) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(lightningBolt[0].x, lightningBolt[0].y);
                    for (let i = 1; i < lightningBolt.length; i++) {
                        ctx.lineTo(lightningBolt[i].x, lightningBolt[i].y);
                    }
                    
                    // Draw neon glowing core
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lightningOpacity * 0.95})`;
                    ctx.lineWidth = (1.5 + Math.random() * 2.0) * (lightningOpacity + 0.2);
                    ctx.shadowColor = 'rgba(125, 188, 255, 0.95)';
                    ctx.shadowBlur = 20;
                    ctx.stroke();
                    ctx.restore();
                }
            } else {
                lightningBolt = null;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (Math.random() < 0.22) {
                createRipple(mouseX, mouseY, 0.8 + Math.random() * 0.2, 0.7);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.touches[0].clientX - rect.left;
                const mouseY = e.touches[0].clientY - rect.top;

                if (Math.random() < 0.22) {
                    createRipple(mouseX, mouseY, 0.8 + Math.random() * 0.2, 0.7);
                }
            }
        };

        window.addEventListener('resize', resize);
        
        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('touchmove', handleTouchMove, { passive: true });
        }

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('touchmove', handleTouchMove);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none block z-0 opacity-80"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
