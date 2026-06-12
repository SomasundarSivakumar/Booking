'use client';

import { useEffect, useRef } from 'react';

interface SpeedTrail {
    lane: number;
    z: number;
    speed: number;
    length: number;
    color: string;
    width: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    blinkSpeed: number;
}

export const MarketplaceCanvasBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Mouse coordinates & target coordinates for interpolation (smooth lerping)
        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

        // Colors based on site styling
        const neonOrange = 'rgba(255, 107, 53, ';
        const neonBlue = 'rgba(70, 130, 180, ';
        const neonAmber = 'rgba(255, 183, 3, ';
        const neonPurple = 'rgba(168, 85, 247, ';

        const colors = [
            neonOrange,
            neonBlue,
            neonAmber,
            neonPurple
        ];

        // 3D Grid State
        let gridProgress = 0;
        const gridSpeed = 0.003; // Speed of the grid lines moving forward

        // Speed trails (flowing light cycles on the highway)
        const trails: SpeedTrail[] = [];
        const maxTrails = 24;

        // Starfield background
        const stars: Star[] = [];
        const maxStars = 80;

        // Initialize elements
        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            width = rect?.width || window.innerWidth;
            height = rect?.height || 700;
            canvas.width = width;
            canvas.height = height;

            // Initialize stars if not initialized
            if (stars.length === 0) {
                for (let i = 0; i < maxStars; i++) {
                    stars.push({
                        x: Math.random() * width,
                        y: Math.random() * height * 0.55, // Keep stars in the upper half of screen
                        size: Math.random() * 1.5 + 0.5,
                        alpha: Math.random(),
                        blinkSpeed: 0.005 + Math.random() * 0.015,
                    });
                }
            } else {
                // Adjust stars positions to fit new dimensions
                stars.forEach(star => {
                    star.x = Math.random() * width;
                    star.y = Math.random() * height * 0.55;
                });
            }

            // Initialize trails
            if (trails.length === 0) {
                for (let i = 0; i < maxTrails; i++) {
                    createTrail(i);
                }
            }
        };

        const createTrail = (index: number) => {
            const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
            trails[index] = {
                lane: Math.floor(Math.random() * 10) - 5, // Lanes from -5 to 4
                z: Math.random(), // Start at a random position
                speed: 0.004 + Math.random() * 0.008,
                length: 0.05 + Math.random() * 0.1,
                color: colorPrefix,
                width: Math.random() * 2 + 1.5,
            };
        };

        const draw = () => {
            // Smoothly interpolate mouse position for parallax
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            ctx.clearRect(0, 0, width, height);

            // Create background vertical gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#0c111d');
            bgGrad.addColorStop(0.5, '#0f172a');
            bgGrad.addColorStop(1, '#111d2e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Compute horizon point based on mouse parallax
            const horizonX = width / 2 - (mouse.x - width / 2) * 0.06;
            const horizonY = height * 0.42 - (mouse.y - height / 2) * 0.06;

            // 1. Draw Stars (Cybernetic Dust)
            stars.forEach(star => {
                star.alpha += star.blinkSpeed;
                if (star.alpha > 1 || star.alpha < 0.1) {
                    star.blinkSpeed = -star.blinkSpeed;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(star.alpha, 0.85))})`;
                ctx.fill();
            });

            // 2. Draw Horizon Line Glow
            const horizonGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 5);
            horizonGrad.addColorStop(0, 'rgba(255, 107, 53, 0)');
            horizonGrad.addColorStop(0.7, 'rgba(255, 107, 53, 0.04)');
            horizonGrad.addColorStop(1, 'rgba(255, 107, 53, 0.15)');
            ctx.fillStyle = horizonGrad;
            ctx.fillRect(0, horizonY - 40, width, 45);

            ctx.beginPath();
            ctx.moveTo(0, horizonY);
            ctx.lineTo(width, horizonY);
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 3. Draw 3D Grid Floor
            // Update grid scrolling progress
            gridProgress += gridSpeed;
            if (gridProgress >= 1.0) gridProgress -= 1.0;

            const gridStartHeight = horizonY;
            const gridEndHeight = height;
            const gridPlaneHeight = gridEndHeight - gridStartHeight;

            // Perspective helper function (Z coordinate mapped exponentially)
            const getScreenY = (zVal: number) => {
                return gridStartHeight + gridPlaneHeight * Math.pow(zVal, 2.2);
            };

            const getScreenX = (lane: number, yVal: number) => {
                const relativeY = (yVal - gridStartHeight) / gridPlaneHeight;
                // How far outward the lanes spread at the bottom
                const bottomSpreadWidth = width * 1.5; 
                const bottomOffset = lane * (bottomSpreadWidth / 10);
                // Linear interpolation of width from horizon (0) to bottom (bottomOffset)
                return horizonX + bottomOffset * relativeY;
            };

            // Draw radial lines (highway lanes)
            const numLanes = 12; // -6 to 5
            for (let l = -6; l <= 6; l++) {
                ctx.beginPath();
                // Determine lane style - center line is brighter/dashed
                const isCenter = l === 0;
                const isEdge = Math.abs(l) === 5;
                
                ctx.moveTo(horizonX, horizonY);
                ctx.lineTo(getScreenX(l, height), height);
                
                if (isCenter) {
                    ctx.strokeStyle = 'rgba(255, 183, 3, 0.25)';
                    ctx.lineWidth = 2.0;
                } else if (isEdge) {
                    ctx.strokeStyle = 'rgba(70, 130, 180, 0.4)';
                    ctx.lineWidth = 2.5;
                } else {
                    ctx.strokeStyle = 'rgba(70, 130, 180, 0.12)';
                    ctx.lineWidth = 1.0;
                }
                ctx.stroke();
            }

            // Draw horizontal perspective lines scrolling towards camera
            const numHorizontalLines = 14;
            for (let i = 0; i < numHorizontalLines; i++) {
                // offset grid lines by gridProgress to scroll them
                const z = (i + gridProgress) / numHorizontalLines;
                const y = getScreenY(z);

                ctx.beginPath();
                ctx.moveTo(getScreenX(-6, y), y);
                ctx.lineTo(getScreenX(6, y), y);

                // Grid lines get thicker and more visible as they scroll closer (higher z)
                const opacity = z * 0.18;
                ctx.strokeStyle = `rgba(70, 130, 180, ${opacity})`;
                ctx.lineWidth = 0.5 + z * 1.5;
                ctx.stroke();
            }

            // 4. Draw Neon Speed Trails (Cars/Bikes)
            trails.forEach((trail, i) => {
                trail.z += trail.speed;

                // Reset trail once it reaches the bottom
                if (trail.z > 1) {
                    createTrail(i);
                    return;
                }

                const startZ = Math.max(0.01, trail.z - trail.length);
                const endZ = Math.min(0.99, trail.z);

                const startY = getScreenY(startZ);
                const endY = getScreenY(endZ);

                const startX = getScreenX(trail.lane + 0.5, startY);
                const endX = getScreenX(trail.lane + 0.5, endY);

                // Fade trail opacity near horizon and near bottom
                let alpha = 1.0;
                if (trail.z < 0.2) {
                    alpha = (trail.z / 0.2); // Fade in from horizon
                } else if (trail.z > 0.8) {
                    alpha = 1 - (trail.z - 0.8) / 0.2; // Fade out near bottom
                }

                // Screen properties
                const sizeFactor = trail.z; // larger as it gets closer
                const lineWidth = trail.width * (0.3 + sizeFactor * 4);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);

                // Glowing drop shadow effect
                ctx.shadowColor = `${trail.color}${alpha * 0.85})`;
                ctx.shadowBlur = 10 + sizeFactor * 10;
                
                ctx.strokeStyle = `${trail.color}${alpha * 0.9})`;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.restore();
            });

            // 5. Draw Mouse Interactive Glow Aura
            if (mouse.active) {
                const auraGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
                auraGrad.addColorStop(0, 'rgba(255, 107, 53, 0.08)');
                auraGrad.addColorStop(0.5, 'rgba(70, 130, 180, 0.03)');
                auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = auraGrad;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.targetX = width / 2;
            mouse.targetY = height * 0.5;
            mouse.active = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.targetX = e.touches[0].clientX - rect.left;
                mouse.targetY = e.touches[0].clientY - rect.top;
                mouse.active = true;
            }
        };

        window.addEventListener('resize', resize);
        
        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('mouseleave', handleMouseLeave);
            parent.addEventListener('touchmove', handleTouchMove, { passive: true });
            parent.addEventListener('touchend', handleMouseLeave, { passive: true });
            
            // Set initial mouse coordinates to center
            mouse.x = parent.clientWidth / 2;
            mouse.y = parent.clientHeight * 0.5;
            mouse.targetX = mouse.x;
            mouse.targetY = mouse.y;
        }

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('mouseleave', handleMouseLeave);
                parent.removeEventListener('touchmove', handleTouchMove);
                parent.removeEventListener('touchend', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none block z-0 transition-opacity duration-1000"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
