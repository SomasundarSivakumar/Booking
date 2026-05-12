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
                <Link href="/" className="group flex items-center space-x-2">
                    <div className="flex flex-col">
                        <span className="font-heading text-xl md:text-3xl font-extrabold tracking-tighter text-white leading-none">
                            PRAKASH <span className="text-amber-accent">TRAVEL</span>
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gray-400 font-bold group-hover:text-amber-accent transition-colors">
                            Premium Mobility
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-10">
                    {['Home', 'Fleet', 'Booking', 'Services', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="relative font-sans text-sm font-bold uppercase tracking-widest text-white/80 hover:text-amber-accent transition-colors duration-300 group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-accent transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                {/* Call to Action */}
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col items-end mr-2 text-white/60">
                        <span className="text-[0.6rem] uppercase font-bold tracking-widest">Need Help?</span>
                        <span className="text-sm font-bold text-white">+91 98765 43210</span>
                    </div>
                    <button
                        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                        className="hidden cursor-pointer md:block bg-dynamic-orange hover:bg-amber-accent text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-dynamic-orange/20 border border-white/10"
                    >
                        Book Now
                    </button>

                    {/* Mobile Menu Toggle (Simplified) */}
                    <button className="lg:hidden text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};
