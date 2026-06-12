'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger if not already registered
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        // Synchronize ScrollTrigger with Lenis scroll events
        lenis.on('scroll', ScrollTrigger.update);

        // Bind Lenis scroll loop to GSAP's ticker for absolute synchronization
        const updateTicker = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(updateTicker);

        // Reset scroll position on page refresh to prevent jumps
        window.scrollTo(0, 0);

        return () => {
            gsap.ticker.remove(updateTicker);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};
