'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Particle {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    speed: number;
    drift: number;
    color: string;
    pulse: number;
    pulseSpeed: number;
}

interface LightStreak {
    x: number;
    y: number;
    length: number;
    speed: number;
    alpha: number;
    width: number;
    color: string;
}

export const HeroBanner = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const section = document.getElementById('home');
        if (!section) return;

        const chars = section.querySelectorAll('.hero-char');
        const subtext = section.querySelector('.hero-subtext');
        const button = section.querySelector('.hero-btn');

        // Set initial state for repeating scroll animation
        gsap.set(chars, { filter: 'blur(10px)', opacity: 0, y: 15 });
        gsap.set(subtext, { opacity: 0, y: 20 });
        gsap.set(button, { opacity: 0, y: 20 });

        // Delay timeline creation until after loader fades out (2.5s loader duration)
        const timer = setTimeout(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 100%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play none',
                }
            });

            tl.to(chars, {
                filter: 'blur(0px)',
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.015,
                ease: 'power3.out',
            })
            .to(subtext, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            }, '-=0.15')
            .to(button, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            }, '-=0.3');

            // Force recalculation of ScrollTrigger bounds once layout is settled
            ScrollTrigger.refresh();
        }, 2600);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Bokeh particles
        const PARTICLE_COUNT = 80;
        const COLORS = [
            'rgba(255, 165, 50',   // amber-orange
            'rgba(255, 255, 255',  // white
            'rgba(100, 160, 255',  // cool blue
        ];

        const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            alpha: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.3 + 0.05,
            drift: (Math.random() - 0.5) * 0.3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005,
        }));

        // Road light streaks
        const STREAK_COUNT = 12;
        const STREAK_COLORS = [
            'rgba(255, 200, 80',
            'rgba(255, 255, 255',
            'rgba(255, 120, 30',
        ];

        const streaks: LightStreak[] = Array.from({ length: STREAK_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 120 + 60,
            speed: Math.random() * 4 + 2,
            alpha: Math.random() * 0.25 + 0.05,
            width: Math.random() * 1.5 + 0.5,
            color: STREAK_COLORS[Math.floor(Math.random() * STREAK_COLORS.length)],
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // --- Particles (bokeh) ---
            particles.forEach(p => {
                p.pulse += p.pulseSpeed;
                const dynamicAlpha = p.alpha + Math.sin(p.pulse) * 0.12;
                const dynamicRadius = p.radius + Math.sin(p.pulse) * 0.8;

                // Soft glow
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dynamicRadius * 3.5);
                grd.addColorStop(0, `${p.color}, ${dynamicAlpha})`);
                grd.addColorStop(1, `${p.color}, 0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, dynamicRadius * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}, ${Math.min(dynamicAlpha * 2, 0.9)})`;
                ctx.fill();

                // Move
                p.y -= p.speed;
                p.x += p.drift;

                // Wrap
                if (p.y + dynamicRadius * 4 < 0) {
                    p.y = canvas.height + dynamicRadius * 4;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
            });

            // --- Light streaks (road lights) ---
            streaks.forEach(s => {
                const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.length);
                grad.addColorStop(0, `${s.color}, 0)`);
                grad.addColorStop(0.4, `${s.color}, ${s.alpha})`);
                grad.addColorStop(1, `${s.color}, 0)`);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x, s.y + s.length);
                ctx.strokeStyle = grad;
                ctx.lineWidth = s.width;
                ctx.stroke();
                ctx.restore();

                s.y += s.speed;

                if (s.y > canvas.height + s.length) {
                    s.y = -s.length;
                    s.x = Math.random() * canvas.width;
                    s.alpha = Math.random() * 0.25 + 0.05;
                    s.speed = Math.random() * 4 + 2;
                }
            });

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            clearTimeout(timer);
        };
    }, []);

    return (
        <section
            id="home"
            className="relative h-screen w-full bg-[url('/assets/images/hero_banner.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-55 z-0" />

            {/* Canvas animation layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
            />

            {/* Content */}
            <div className="relative z-10 text-center px-3 md:px-6 max-w-4xl mx-auto flex flex-col items-center space-y-8">
                <h1 className="font-heading text-3xl md:text-7xl font-bold text-white uppercase tracking-tight drop-shadow-lg leading-tight">
                    <span className="block mb-2">
                        {"Your Journey,".split('').map((char, index) => (
                            <span key={index} className="hero-char inline-block opacity-0 filter blur-[10px]">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </span>
                    <span className="text-amber-accent block">
                        {"Your Choice".split('').map((char, index) => (
                            <span key={index} className="hero-char inline-block opacity-0 filter blur-[10px]">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </span>
                </h1>

                <p className="hero-subtext font-sans text-lg md:text-2xl text-light-gray max-w-2xl drop-shadow-md opacity-0">
                    Experience seamless travels with Prakash Travels. Book your perfect ride today.
                </p>

                <button
                    onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hero-btn cursor-pointer bg-gradient-to-r from-dynamic-orange to-amber-accent hover:from-amber-accent hover:to-dynamic-orange text-white px-10 py-4 rounded-full text-base font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,107,53,0.4)] hover:shadow-[0_8px_30px_rgba(255,183,3,0.5)] border border-white/20 opacity-0"
                >
                    Book Ride Now
                </button>
            </div>
        </section>
    );
};