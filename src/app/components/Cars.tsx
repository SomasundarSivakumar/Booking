'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CarSpec {
    brand: string;
    name: string;
    type: string;
    seating: string;
    ac: string;
    fuel: string;
    image: string;
    rate: string;
    color: string;
}

const CARS: CarSpec[] = [
    {
        brand: 'Maruti Suzuki',
        name: 'Swift Dzire',
        type: 'Sedan',
        seating: '4 + Driver',
        ac: 'Yes',
        fuel: 'Petrol / CNG',
        image: './assets/images/swift.png',
        rate: '₹11/km',
        color: '#FF6B35',
    },
    {
        brand: 'Maruti Suzuki',
        name: 'Ertiga',
        type: 'MPV',
        seating: '6 + Driver',
        ac: 'Yes',
        fuel: 'Petrol / CNG',
        image: './assets/images/ertiga.png',
        rate: '₹18/km',
        color: '#4682B4',
    },
    {
        brand: 'Toyota',
        name: 'Etios',
        type: 'Sedan',
        seating: '4 + Driver',
        ac: 'Yes',
        fuel: 'Petrol',
        image: './assets/images/etios.png',
        rate: '₹13/km',
        color: '#2D3E50',
    },
    {
        brand: 'Mahindra',
        name: 'Scorpio',
        type: 'SUV',
        seating: '6 + Driver',
        ac: 'Yes',
        fuel: 'Diesel',
        image: './assets/images/scorpio.png',
        rate: '₹18/km',
        color: '#1A252F',
    },
    {
        brand: 'Mahindra',
        name: 'Bolero',
        type: 'SUV',
        seating: '6 + Driver',
        ac: 'Yes',
        fuel: 'Diesel',
        image: './assets/images/Bollero.png',
        rate: '₹16/km',
        color: '#5C4033',
    },
    {
        brand: 'Tata',
        name: 'Zest',
        type: 'Sedan',
        seating: '4 + Driver',
        ac: 'Yes',
        fuel: 'Petrol / Diesel',
        image: './assets/images/zest.png',
        rate: '₹12/km',
        color: '#1A1A2E',
    },
];

export const Cars = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const carImageRef = useRef<HTMLImageElement>(null);
    const carNameRef = useRef<HTMLDivElement>(null);
    const specsRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [displayIndex, setDisplayIndex] = useState(0);
    const prevIndexRef = useRef(0);

    // Animate car transition
    const animateCar = (newIndex: number) => {
        if (newIndex === prevIndexRef.current) return;
        const direction = newIndex > prevIndexRef.current ? 1 : -1;
        prevIndexRef.current = newIndex;

        const tl = gsap.timeline();

        // Slide out old car + fade specs
        tl.to(carImageRef.current, {
            x: direction * -120,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
        }, 0);
        tl.to([carNameRef.current, specsRef.current], {
            y: -20,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
        }, 0);

        // Switch content mid-animation
        tl.call(() => setDisplayIndex(newIndex));

        // Slide in new car + fade specs
        tl.fromTo(carImageRef.current,
            { x: direction * 120, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
        tl.fromTo([carNameRef.current, specsRef.current],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 },
            '<0.1'
        );
    };

    useEffect(() => {
        animateCar(activeIndex);
    }, [activeIndex]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: false,
            onUpdate: (self) => {
                const newIndex = Math.min(
                    Math.floor(self.progress * CARS.length),
                    CARS.length - 1
                );
                setActiveIndex(newIndex);

                // Update progress bar
                if (progressBarRef.current) {
                    progressBarRef.current.style.width = `${self.progress * 100}%`;
                }
            },
        });

        return () => trigger.kill();
    }, []);

    const car = CARS[displayIndex];

    return (
        <section id="fleet" ref={sectionRef} className="relative" style={{ height: `${CARS.length * 100}vh` }}>
            {/* Section Heading — above sticky */}
            <div className="text-black uppercase text-center text-8xl font-bold tracking-tight leading-none pt-20 pb-6">
                Find Your Ride
            </div>
            <div className="text-black/60 text-center text-3xl font-medium tracking-wide pb-4">
                Browse our available cars and book instantly
            </div>

            {/* Sticky viewport */}
            <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden">

                {/* Background road */}
                <div
                    className="absolute inset-0 w-full h-full transition-none"
                    style={{
                        backgroundImage: `url("./assets/images/Road_1.png")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Overlay tint */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Car Name */}
                <div ref={carNameRef} className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">{car.brand}</p>
                    <h2 className="text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                        {car.name.split('/').map((part, i, arr) => (
                            <span key={i}>
                                {part.trim()}
                                {i < arr.length - 1 && <span className="text-dynamic-orange mx-3">/</span>}
                            </span>
                        ))}
                    </h2>
                    <div className="mt-1 px-4 py-1 rounded-full text-sm font-bold tracking-wider text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                        {car.rate}
                    </div>
                </div>

                {/* Car Image — centered at bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                    <img
                        ref={carImageRef}
                        src={car.image}
                        alt={car.name}
                        className="w-[55rem] object-contain"
                    />
                </div>

                {/* Spec Badges — Flanking the car symmetrically */}
                <div ref={specsRef} className="absolute top-[60%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-[95rem] px-10 flex justify-between items-center z-20 pointer-events-none">

                    {/* Left Column: Type & Seating */}
                    <div className="flex flex-col gap-10 pointer-events-auto">
                        {/* Type */}
                        <div className="group flex items-center gap-4 bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl px-7 py-5 shadow-2xl transition-transform hover:scale-105 min-w-[240px]">
                            <div className="w-10 h-10 flex items-center justify-center bg-dynamic-orange/10 rounded-xl">
                                <svg className="w-6 h-6 text-dynamic-orange shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 17H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h.5L6 5h12l2.5 4H21a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
                                    <circle cx="7.5" cy="17" r="2.5" /><circle cx="16.5" cy="17" r="2.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Vehicle Type</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{car.type}</p>
                            </div>
                        </div>

                        {/* Seating */}
                        <div className="group flex items-center gap-4 bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl px-7 py-5 shadow-2xl transition-transform hover:scale-105 min-w-[240px]">
                            <div className="w-10 h-10 flex items-center justify-center bg-dynamic-orange/10 rounded-xl">
                                <svg className="w-6 h-6 text-dynamic-orange shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Capacity</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{car.seating}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AC & Fuel */}
                    <div className="flex flex-col gap-10 pointer-events-auto">
                        {/* AC */}
                        <div className="group flex items-center gap-4 bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl px-7 py-5 shadow-2xl transition-transform hover:scale-105 min-w-[240px]">
                            <div className="w-10 h-10 flex items-center justify-center bg-dynamic-orange/10 rounded-xl">
                                <svg className="w-6 h-6 text-dynamic-orange shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="2" x2="12" y2="22" />
                                    <path d="M5 8l7 4 7-4" /><path d="M5 16l7-4 7 4" />
                                    <path d="M8 5l4 3 4-3" /><path d="M8 19l4-3 4 3" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Comfort</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{car.ac === 'Yes' ? 'Full AC' : car.ac}</p>
                            </div>
                        </div>

                        {/* Fuel */}
                        <div className="group flex items-center gap-4 bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl px-7 py-5 shadow-2xl transition-transform hover:scale-105 min-w-[240px]">
                            <div className="w-10 h-10 flex items-center justify-center bg-dynamic-orange/10 rounded-xl">
                                <svg className="w-6 h-6 text-dynamic-orange shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="22" x2="15" y2="22" /><line x1="4" y1="9" x2="14" y2="9" />
                                    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
                                    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Energy</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{car.fuel}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Scroll progress bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">
                    <div
                        ref={progressBarRef}
                        className="h-full bg-dynamic-orange transition-none"
                        style={{ width: '0%' }}
                    />
                </div>

                {/* Car counter dots */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
                    {CARS.map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${i === displayIndex
                                ? 'w-3 h-3 bg-dynamic-orange'
                                : 'w-2 h-2 bg-white/40'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};