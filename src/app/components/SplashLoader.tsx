'use client';
import { useEffect, useState } from 'react';

export const SplashLoader = () => {
    const [statusText, setStatusText] = useState('Initializing system...');
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Status text cycle
        const statuses = [
            'Initializing system...',
            'Connecting to servers...',
            'Loading vehicles fleet...',
            'Readying your ride...',
        ];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % statuses.length;
            setStatusText(statuses[idx]);
        }, 800);

        // Simulated loader timing: 2.0s display, then 500ms fadeout
        const fadeTimeout = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        const removeTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2D3E50] text-white transition-opacity duration-500 ease-in-out ${
                isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35] rounded-full blur-[120px] opacity-10 animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4682B4] rounded-full blur-[120px] opacity-15 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
                {/* Brand Logo Header */}
                <div className="flex flex-col items-center gap-1">
                    <span className="font-heading text-2xl md:text-3xl font-black uppercase tracking-[0.25em]">
                        Prakash <span className="text-[#FF6B35]">Travel</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-semibold">
                        Premium Mobility
                    </span>
                </div>

                {/* Main animated loading graphic */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Pulsing glow ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/5 bg-white/2 backdrop-blur-sm shadow-[0_0_50px_rgba(255,107,53,0.15)] animate-pulse" />

                    {/* Outer spinning ring - Steel Blue */}
                    <div className="absolute w-28 h-28 rounded-full border-t-2 border-r-2 border-b-2 border-l-2 border-t-[#4682B4] border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }} />

                    {/* Inner counter-spinning ring - Dynamic Orange */}
                    <div className="absolute w-20 h-20 rounded-full border-t-2 border-r-2 border-b-2 border-l-2 border-b-[#FF6B35] border-r-transparent border-t-transparent border-l-transparent animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />

                    {/* Center glowing core - Amber Accent */}
                    <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FF6B35] shadow-[0_0_20px_#FF6B35] animate-ping" />
                    <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FF6B35] shadow-[0_0_10px_#FF6B35]" />
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-center gap-2">
                    <p className="font-heading text-sm uppercase tracking-[0.2em] text-[#FFB703] font-bold h-6 animate-pulse">
                        {statusText}
                    </p>
                    <p className="text-xs text-gray-400 font-sans tracking-wide">
                        Please wait while we prepare your journey.
                    </p>
                </div>
            </div>
        </div>
    );
};
