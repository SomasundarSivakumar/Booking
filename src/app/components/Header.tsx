'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Background logic:
            // Remove background if we are at the very top (Hero Banner area)
            // Apply glassmorphism if we have scrolled down a bit
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Visibility logic:
            // Hide on scroll down, show on scroll up
            // Always show if we are near the top
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                } ${isScrolled
                    ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-3 md:px-12 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" title="Prakash Travels Home" className="group flex items-center space-x-2">
                    <div className="flex flex-col">
                        <span className="font-heading text-xl md:text-3xl font-extrabold tracking-tighter text-white leading-none">
                            PRAKASH <span className="text-amber-accent">TRAVELS</span>
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gray-400 font-bold group-hover:text-amber-accent transition-colors">
                            Premium Mobility
                        </span>
                    </div>
                </Link>



                {/* Call to Action */}
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col items-end mr-2 text-white/60">
                        <span className="text-[0.6rem] uppercase font-bold tracking-widest">Need Help?</span>
                        <a href="tel:+917092022232" title="Call Prakash Travels Customer Support" className="text-sm font-bold text-white hover:text-dynamic-orange transition-colors">+91 70920 22232</a>
                    </div>
                    <button
                        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                        className="hidden cursor-pointer md:block bg-dynamic-orange hover:bg-amber-accent text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-dynamic-orange/20 border border-white/10"
                    >
                        Book Now
                    </button>


                </div>
            </div>
        </header>
    );
};
