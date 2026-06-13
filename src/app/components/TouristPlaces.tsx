"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Star, ArrowRight, Clock, Camera } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const PLACES = [
    {
        name: "Mahabalipuram",
        subtitle: "Shore Temple & Rock Carvings",
        description: "A UNESCO World Heritage Site featuring stunning 7th-century stone temples and intricate rock carvings along the Bay of Bengal coastline.",
        image: "/assets/images/Maha.jpg",
        rating: 4.8,
        duration: "1 Day Trip",
        distance: "58 km from Chennai",
        tag: "Heritage",
        tagColor: "#FF6B35",
    },
    {
        name: "Ooty",
        subtitle: "Queen of Hill Stations",
        description: "Nestled in the Nilgiri Hills, Ooty enchants visitors with lush tea gardens, serene lakes, the famous toy train, and cool misty weather year-round.",
        image: "/assets/images/Ooty.jpg",
        rating: 4.9,
        duration: "2–3 Days",
        distance: "270 km from Coimbatore",
        tag: "Hill Station",
        tagColor: "#22c55e",
    },
    {
        name: "Madurai",
        subtitle: "Meenakshi Amman Temple",
        description: "Home to the iconic Meenakshi Temple with its towering gopurams, Madurai is one of the oldest living cities in the world with rich Dravidian heritage.",
        image: "/assets/images/Mad.jpg",
        rating: 4.7,
        duration: "1–2 Days",
        distance: "462 km from Chennai",
        tag: "Spiritual",
        tagColor: "#a855f7",
    },
    {
        name: "Rameswaram",
        subtitle: "Sacred Island Temple Town",
        description: "Connected by the Pamban Bridge, Rameswaram is one of the holiest pilgrimage sites in India, famous for the Ramanathaswamy Temple and pristine beaches.",
        image: "/assets/images/Ram.jpg",
        rating: 4.8,
        duration: "1–2 Days",
        distance: "573 km from Chennai",
        tag: "Pilgrimage",
        tagColor: "#ef4444",
    },
    {
        name: "Kodaikanal",
        subtitle: "Princess of Hill Stations",
        description: "A breathtaking hill station known for its star-shaped lake, dense pine forests, stunning waterfalls, and panoramic views from Coaker's Walk.",
        image: "/assets/images/Kodai.jpg",
        rating: 4.8,
        duration: "2–3 Days",
        distance: "120 km from Madurai",
        tag: "Nature",
        tagColor: "#06b6d4",
    },
    {
        name: "Thanjavur",
        subtitle: "Brihadeeswara Temple",
        description: "The cultural capital of Tamil Nadu, Thanjavur boasts the magnificent Big Temple — a masterpiece of Chola architecture and a UNESCO World Heritage Site.",
        image: "/assets/images/Thanjai.jpg",
        rating: 4.7,
        duration: "1 Day Trip",
        distance: "350 km from Chennai",
        tag: "UNESCO",
        tagColor: "#f59e0b",
    },
];

export const TouristPlaces = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const chars = section.querySelectorAll('.places-char');
        const word = section.querySelector('.places-word');
        const badge = section.querySelector('.places-badge');
        const subtext = section.querySelector('.places-subtext');
        const divider = section.querySelector('.places-divider');
        const cards = section.querySelectorAll('.place-card');

        gsap.set(chars, { opacity: 0, y: 15 });
        gsap.set(word, { opacity: 0, y: 15 });
        gsap.set(badge, { opacity: 0, y: -15 });
        gsap.set(subtext, { opacity: 0, y: 20 });
        gsap.set(divider, { opacity: 0, scale: 0.5 });
        gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
            }
        });

        tl.to(badge, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
        })
            .to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.01,
                ease: 'power3.out',
            }, '-=0.2')
            .to(word, {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: 'power3.out',
            }, '-=0.2')
            .to(subtext, {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
            }, '-=0.2')
            .to(divider, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
            }, '-=0.3')
            .to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                stagger: 0.05,
                ease: 'power2.out',
            }, '-=0.2');
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-white py-8 lg:py-28 overflow-hidden font-heading">
            {/* Subtle background texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            {/* Decorative blurred shapes */}
            <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-dynamic-orange/[0.04] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full bg-steel-blue/[0.04] blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-[88%] mx-auto">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="places-badge inline-flex items-center gap-2 text-[0.65rem] font-black tracking-[4px] uppercase px-5 py-2 rounded-full bg-dynamic-orange/[0.08] border border-dynamic-orange/15 text-dynamic-orange mb-5">
                        <Camera size={12} strokeWidth={2.5} />
                        Explore Tamil Nadu
                    </div>
                    <h3 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-gray-900 leading-tight mb-4">
                        {"Top Tourist ".split('').map((char, index) => (
                            <span key={index} className="places-char inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                        <span className="places-word bg-gradient-to-r from-dynamic-orange to-amber-accent bg-clip-text text-transparent inline-block">
                            Destinations
                        </span>
                    </h3>
                    <p className="places-subtext text-gray-500 text-[1rem] leading-7 max-w-[520px] mx-auto">
                        Discover the most breathtaking places in Tamil Nadu. Book your ride with us and explore the beauty of South India.
                    </p>
                    {/* Decorative line */}
                    <div className="places-divider flex items-center justify-center gap-3 mt-6">
                        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-dynamic-orange/40" />
                        <div className="w-2 h-2 rounded-full bg-dynamic-orange" />
                        <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-dynamic-orange/40" />
                    </div>
                </div>

                {/* Places Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {PLACES.map((place, index) => (
                        <div
                            key={place.name}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="place-card group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
                            style={{
                                boxShadow: hoveredIndex === index
                                    ? '0 25px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)'
                                    : '0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
                                transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative h-[220px] overflow-hidden">
                                <img
                                    src={place.image}
                                    alt={place.name}
                                    title={`Explore ${place.name} with Prakash Travels`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                {/* Tag */}
                                <span
                                    className="absolute top-4 left-4 text-[0.62rem] font-black uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md border"
                                    style={{
                                        background: `${place.tagColor}18`,
                                        color: '#fff',
                                        borderColor: `${place.tagColor}40`,
                                        boxShadow: `0 4px 12px ${place.tagColor}25`,
                                    }}
                                >
                                    {place.tag}
                                </span>

                                {/* Rating */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[0.7rem] font-bold text-gray-800">{place.rating}</span>
                                </div>

                                {/* Bottom info on image */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="text-white text-xl font-extrabold leading-tight mb-1 drop-shadow-lg">{place.name}</div>
                                    <p className="text-white/80 text-[0.75rem] font-semibold">{place.subtitle}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-gray-500 text-[0.82rem] leading-6 mb-4">{place.description}</p>

                                {/* Meta pills */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                                        <Clock size={11} strokeWidth={2} className="text-dynamic-orange" />
                                        {place.duration}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                                        <MapPin size={11} strokeWidth={2} className="text-dynamic-orange" />
                                        {place.distance}
                                    </span>
                                </div>

                                {/* CTA */}
                                <div className="flex items-center justify-between">
                                    <button
                                        className="inline-flex items-center gap-2 text-[0.78rem] font-bold text-dynamic-orange group-hover:gap-3 transition-all duration-300 bg-transparent border-none cursor-pointer p-0"
                                    >
                                        Book a Ride
                                        <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-dynamic-orange/10 flex items-center justify-center">
                                            <MapPin size={10} className="text-dynamic-orange" />
                                        </div>
                                        <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Tamil Nadu</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover accent bar */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-500"
                                style={{
                                    background: `linear-gradient(90deg, ${place.tagColor}, ${place.tagColor}80)`,
                                    opacity: hoveredIndex === index ? 1 : 0,
                                    transform: hoveredIndex === index ? 'scaleX(1)' : 'scaleX(0)',
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                {/* <div className="mt-16 text-center">
                    <p className="text-gray-400 text-sm mb-5">Want to explore more? We cover 50+ destinations across Tamil Nadu.</p>
                    <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-dynamic-orange to-amber-accent text-white text-[0.85rem] font-bold border-none cursor-pointer shadow-[0_8px_25px_rgba(255,107,53,0.25)] hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(255,107,53,0.35)] transition-all uppercase tracking-wider">
                        <MapPin size={16} strokeWidth={2} />
                        View All Destinations
                    </button>
                </div> */}
            </div>
        </section>
    );
};
