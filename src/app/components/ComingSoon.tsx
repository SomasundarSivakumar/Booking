"use client";

import { useEffect, useRef, useState } from "react";
import {
    Car, Bike, Bell, Phone, MapPin, ShoppingBag,
    Shield, FileCheck, CreditCard, Gauge, Mail,
    ArrowRight, CheckCircle2, Sparkles, Clock, Calculator, ShieldCheck, Star
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MarketplaceCanvasBg } from "./MarketplaceCanvasBg";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Vehicle {
    brand: string;
    name: string;
    rate: string;
    image: string;
    year: string;
    km: string;
    fuel: string;
    owner: string;
    rating: string;
    type: string;
}

const CAR_INVENTORY: Vehicle[] = [
    { brand: 'Maruti Suzuki', name: 'Swift Dzire ZXI', rate: '₹3.4L - ₹4.1L', image: '/assets/images/swift.png', year: '2019', km: '48k km', fuel: 'Petrol / CNG', owner: '1st Owner', rating: '4.8', type: 'Sedan' },
    { brand: 'Mahindra', name: 'Scorpio S11', rate: '₹8.9L - ₹10.2L', image: '/assets/images/scorpio.png', year: '2020', km: '62k km', fuel: 'Diesel', owner: '1st Owner', rating: '4.9', type: 'SUV' },
    { brand: 'Toyota', name: 'Etios GD', rate: '₹3.8L - ₹4.5L', image: '/assets/images/Etios.png', year: '2018', km: '75k km', fuel: 'Petrol', owner: '2nd Owner', rating: '4.7', type: 'Sedan' },
    { brand: 'Maruti Suzuki', name: 'Ertiga ZXI', rate: '₹7.2L - ₹8.1L', image: '/assets/images/ertiga.png', year: '2021', km: '38k km', fuel: 'Petrol / CNG', owner: '1st Owner', rating: '4.8', type: 'MPV' },
];

const BIKE_INVENTORY: Vehicle[] = [
    { brand: 'Royal Enfield', name: 'Classic 350', rate: '₹1.4L - ₹1.6L', image: '/assets/images/used_bikes.jpg', year: '2020', km: '22k km', fuel: '350cc • Petrol', owner: '1st Owner', rating: '4.9', type: 'Cruiser' },
    { brand: 'Yamaha', name: 'YZF R15 V3', rate: '₹1.1L - ₹1.3L', image: '/assets/images/used_bikes.jpg', year: '2021', km: '18k km', fuel: '155cc • Petrol', owner: '1st Owner', rating: '4.8', type: 'Sports' },
    { brand: 'Honda', name: 'Activa 6G DLX', rate: '₹48k - ₹55k', image: '/assets/images/used_bikes.jpg', year: '2022', km: '9.5k km', fuel: '110cc • Petrol', owner: '1st Owner', rating: '4.6', type: 'Scooter' },
];

export const ComingSoon = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    // Showcase state
    const [activeTab, setActiveTab] = useState<'cars' | 'bikes'>('cars');

    // Valuation calculator state
    const [category, setCategory] = useState<'car' | 'bike'>('car');
    const [brand, setBrand] = useState('');
    const [year, setYear] = useState('');
    const [km, setKm] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [calcResult, setCalcResult] = useState<{ min: number; max: number } | null>(null);
    const [animatedMin, setAnimatedMin] = useState(0);
    const [animatedMax, setAnimatedMax] = useState(0);
    const [calculatorError, setCalculatorError] = useState('');

    // Newsletter state
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [emailError, setEmailError] = useState('');

    const features = [
        { icon: <Shield size={22} strokeWidth={1.5} />, title: "Verified Vehicles", desc: "Every vehicle inspected & certified" },
        { icon: <FileCheck size={22} strokeWidth={1.5} />, title: "RC Transfer", desc: "Complete documentation assistance" },
        { icon: <CreditCard size={22} strokeWidth={1.5} />, title: "Easy EMI", desc: "Flexible financing options available" },
        { icon: <Gauge size={22} strokeWidth={1.5} />, title: "Best Prices", desc: "Market-competitive pricing guaranteed" },
    ];

    // Brands config
    const brandsMap = {
        car: ['Maruti Suzuki', 'Mahindra', 'Toyota', 'Tata', 'Hyundai'],
        bike: ['Royal Enfield', 'Yamaha', 'Honda', 'TVS', 'Hero']
    };

    // Calculate Valuation
    const handleCalculateValuation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !year || !km) {
            setCalculatorError('Please select all fields.');
            return;
        }
        setCalculatorError('');
        setIsCalculating(true);
        setCalcResult(null);

        // Simulated algorithmic base pricing
        let basePrice = 500000; // default base
        if (category === 'car') {
            if (brand === 'Mahindra') basePrice = 950000;
            else if (brand === 'Toyota') basePrice = 650000;
            else if (brand === 'Tata') basePrice = 520000;
            else if (brand === 'Maruti Suzuki') basePrice = 480000;
            else if (brand === 'Hyundai') basePrice = 500000;
        } else {
            if (brand === 'Royal Enfield') basePrice = 190000;
            else if (brand === 'Yamaha') basePrice = 150000;
            else if (brand === 'Honda') basePrice = 80000;
            else if (brand === 'TVS') basePrice = 110000;
            else if (brand === 'Hero') basePrice = 70000;
        }

        // Depreciation factor based on year
        const yearsPassed = 2026 - parseInt(year);
        const depFactor = Math.max(0.25, Math.pow(0.88, yearsPassed));

        // KM factor
        let kmFactor = 1.0;
        if (km === '15-40k') kmFactor = 0.90;
        else if (km === '40-70k') kmFactor = 0.80;
        else if (km === '70k+') kmFactor = 0.68;

        // Final valuation
        const midVal = Math.round(basePrice * depFactor * kmFactor);
        const randomNoise = (Math.random() * 0.06 - 0.03); // +/- 3%
        const noisyMid = Math.round(midVal * (1 + randomNoise));

        const minVal = Math.round(noisyMid * 0.93);
        const maxVal = Math.round(noisyMid * 1.07);

        setTimeout(() => {
            setIsCalculating(false);
            setCalcResult({ min: minVal, max: maxVal });

            // Animate count-up
            let start = 0;
            const duration = 900; // ms
            const startTime = performance.now();

            const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);

                setAnimatedMin(Math.floor(ease * minVal));
                setAnimatedMax(Math.floor(ease * maxVal));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }, 1300);
    };

    // Newsletter Submission
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Email is required.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setEmailError('');
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubscribed(true);
        }, 1100);
    };

    // Auto-update brand options when category changes
    useEffect(() => {
        setBrand('');
        setCalcResult(null);
    }, [category]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Launcher elements
        const badge = section.querySelector('.soon-badge');
        const chars = section.querySelectorAll('.soon-char');
        const words = section.querySelectorAll('.soon-word');
        const subtext = section.querySelector('.soon-subtext');
        const showcase = section.querySelector('.soon-showcase-container');
        const featuresList = section.querySelectorAll('.soon-feature');
        const newsletter = section.querySelector('.soon-newsletter-container');

        gsap.set([chars, words], { opacity: 0, y: 15 });
        gsap.set(badge, { opacity: 0, y: -15 });
        gsap.set(subtext, { opacity: 0, y: 20 });
        gsap.set(showcase, { opacity: 0, y: 35 });
        gsap.set(featuresList, { opacity: 0, y: 25 });
        gsap.set(newsletter, { opacity: 0, y: 20 });

        const tlLauncher = gsap.timeline({
            scrollTrigger: {
                trigger: section.querySelector('.coming-soon-content'),
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
            }
        });

        tlLauncher.to(badge, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
        })
            .to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.005,
                ease: 'power3.out',
            }, '-=0.2')
            .to(words, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.02,
                ease: 'power3.out',
            }, '-=0.15')
            .to(subtext, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.15')
            .to(showcase, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.2')
            .to(newsletter, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.15')
            .to(featuresList, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power2.out',
            }, '-=0.15');
    }, []);

    const formatCurrency = (val: number) => {
        if (val >= 100000) {
            return `₹${(val / 100000).toFixed(2)} Lakhs`;
        }
        return `₹${val.toLocaleString('en-IN')}`;
    };

    return (
        <section ref={sectionRef} className="relative bg-[#0c111d] overflow-hidden font-heading text-slate-200 min-h-screen">

            {/* ── High Performance Interactive Canvas Background ── */}
            <MarketplaceCanvasBg />

            {/* Content Container */}
            <div className="coming-soon-content relative z-10 py-16 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-[95%] xl:max-w-[85%] mx-auto">

                {/* 1. Launcher Badge */}
                <div className="flex justify-center mb-8 md:mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-dynamic-orange/20 blur-xl rounded-full" />
                        <span className="soon-badge relative inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[5px] uppercase px-6 py-2.5 rounded-full bg-slate-900/80 border border-dynamic-orange/40 text-dynamic-orange shadow-lg shadow-black/50 backdrop-blur-md">
                            <span className="w-2 h-2 bg-dynamic-orange rounded-full animate-pulse" />
                            Launching Soon
                        </span>
                    </div>
                </div>

                {/* 2. Main Title */}
                <div className="text-center mb-16">
                    <h4 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-white leading-[1.15] mb-5 tracking-tight">
                        {"Second Hand ".split('').map((char, index) => (
                            <span key={`sh-${index}`} className="soon-char inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                        <br className="sm:hidden" />
                        <span className="soon-word bg-gradient-to-r from-dynamic-orange via-amber-accent to-dynamic-orange bg-clip-text text-transparent inline-block font-black">
                            Cars
                        </span>
                        {" & ".split('').map((char, index) => (
                            <span key={`and-${index}`} className="soon-char inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                        <span className="soon-word bg-gradient-to-r from-steel-blue via-cyan-400 to-steel-blue bg-clip-text text-transparent inline-block font-black">
                            Bikes
                        </span>
                        {" Marketplace".split('').map((char, index) => (
                            <span key={`mp-${index}`} className="soon-char inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h4>
                    <p className="soon-subtext text-slate-400 text-[1.05rem] leading-8 max-w-[620px] mx-auto">
                        Your upcoming trusted destination to buy & sell verified, pre-owned vehicles. Inspected thoroughly, documented securely, and priced transparently.
                    </p>
                </div>

                {/* 3. Interactive Dashboard Showcase (Two Column Layout) */}
                <div className="soon-showcase-container hidden lg:grid-cols-12 gap-8 mb-16">

                    {/* Left Column: Tabbed Inventory Preview (7/12 width) */}
                    <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">

                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-steel-blue/10 to-transparent blur-3xl pointer-events-none" />

                        <div>
                            {/* Inventory Header & Tabs */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                <div>
                                    <div className="text-lg font-bold text-white flex items-center gap-2">
                                        <Sparkles size={16} className="text-amber-accent" />
                                        Hot Listings Preview
                                    </div>
                                </div>

                                <div className="flex bg-slate-900 border border-white/10 p-1 rounded-xl w-full sm:w-auto">
                                    <button
                                        onClick={() => setActiveTab('cars')}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none ${activeTab === 'cars' ? 'bg-dynamic-orange text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Car size={14} />
                                        Used Cars
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bikes')}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none ${activeTab === 'bikes' ? 'bg-steel-blue text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Bike size={14} />
                                        Used Bikes
                                    </button>
                                </div>
                            </div>

                            {/* Inventory Cards */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                {(activeTab === 'cars' ? CAR_INVENTORY : BIKE_INVENTORY).map((v, idx) => (
                                    <div
                                        key={`${activeTab}-${idx}`}
                                        className="group relative bg-[#080d19]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        {/* Tag details */}
                                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-accent">
                                            <Star size={10} className="fill-amber-accent" />
                                            {v.rating}
                                        </div>

                                        {/* Image Area */}
                                        <div className="relative h-36 bg-slate-900/40 flex items-center justify-center overflow-hidden p-3 border-b border-white/5">
                                            <img
                                                src={v.image}
                                                alt={v.name}
                                                title={`${v.brand} ${v.name}`}
                                                className={`object-contain transition-transform duration-500 group-hover:scale-108 ${activeTab === 'cars' ? 'max-h-24 w-auto' : 'w-full h-full object-cover rounded-lg'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                            <div className="absolute bottom-2 left-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                {v.brand}
                                            </div>
                                        </div>

                                        {/* Spec Details */}
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="text-white text-sm font-extrabold group-hover:text-amber-accent transition-colors">
                                                    {v.name}
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 my-3 text-[10px] text-slate-400 font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={11} className="text-slate-500 shrink-0" />
                                                        {v.year} Model
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Gauge size={11} className="text-slate-500 shrink-0" />
                                                        {v.km}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ShieldCheck size={11} className="text-slate-500 shrink-0" />
                                                        {v.owner}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Car size={11} className="text-slate-500 shrink-0" />
                                                        {v.fuel}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cost and Action */}
                                            <div className="flex justify-between items-center pt-2.5 border-t border-white/5 mt-1">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-none">Est. Range</p>
                                                    <p className="text-sm font-black text-white mt-1">{v.rate}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedService(`Inquire: ${v.brand} ${v.name}`);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-extrabold tracking-wider uppercase transition-all cursor-pointer hover:border-white/30"
                                                >
                                                    Inquire
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Interactive Quick Valuation Calculator (5/12 width) */}
                    <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">

                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-dynamic-orange/10 to-transparent blur-3xl pointer-events-none" />

                        <div>
                            {/* Widget Title */}
                            <div className="mb-6 border-b border-white/5 pb-4">
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    <Calculator size={16} className="text-dynamic-orange" />
                                    Smart Valuation Estimator
                                </div>
                            </div>

                            {/* Estimator Form */}
                            <form onSubmit={handleCalculateValuation} className="space-y-4">

                                {/* Category Toggle */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Vehicle Type</label>
                                    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900 border border-white/10 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setCategory('car')}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${category === 'car' ? 'bg-slate-800 text-dynamic-orange border border-dynamic-orange/30' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Car
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategory('bike')}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${category === 'bike' ? 'bg-slate-800 text-steel-blue border border-steel-blue/30' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Bike
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Brand Select */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Brand</label>
                                    <select
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-dynamic-orange/50 transition-colors"
                                    >
                                        <option value="">Select Brand</option>
                                        {brandsMap[category].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Row for Year and KM */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Reg. Year</label>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-dynamic-orange/50 transition-colors"
                                        >
                                            <option value="">Year</option>
                                            {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">KM Driven</label>
                                        <select
                                            value={km}
                                            onChange={(e) => setKm(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-dynamic-orange/50 transition-colors"
                                        >
                                            <option value="">KM Driven</option>
                                            <option value="<15k">{"< 15,000 km"}</option>
                                            <option value="15-40k">15,000 - 40,000 km</option>
                                            <option value="40-70k">40,000 - 70,000 km</option>
                                            <option value="70k+">70,000 km +</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Calculate Button */}
                                <button
                                    type="submit"
                                    disabled={isCalculating}
                                    className="w-full py-3.5 bg-gradient-to-r from-dynamic-orange to-amber-accent text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl hover:opacity-95 cursor-pointer border-none uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isCalculating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Running Valuation...
                                        </>
                                    ) : (
                                        <>
                                            Check Resale Value
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>

                                {calculatorError && (
                                    <p className="text-red-500 text-[10px] font-bold text-center mt-1">{calculatorError}</p>
                                )}
                            </form>
                        </div>

                        {/* Result Display Area */}
                        <div className="mt-6 min-h-[105px] flex items-center justify-center bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                            {isCalculating && (
                                <div className="text-center">
                                    <p className="text-slate-400 text-xs animate-pulse font-medium">Querying local market indices...</p>
                                </div>
                            )}

                            {!isCalculating && !calcResult && (
                                <div className="text-center text-slate-500">
                                    <Calculator size={24} className="mx-auto mb-2 opacity-30 text-slate-400" />
                                    <p className="text-xs font-medium">Results will render here after calculation</p>
                                </div>
                            )}

                            {!isCalculating && calcResult && (
                                <div className="w-full text-center animate-scale-in">
                                    <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-green-400 tracking-wider mb-2">
                                        <CheckCircle2 size={11} />
                                        Algorithmic Estimate
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                                        <span className="text-dynamic-orange">{formatCurrency(animatedMin)}</span>
                                        <span className="text-slate-600 text-lg"> - </span>
                                        <span className="text-dynamic-orange">{formatCurrency(animatedMax)}</span>
                                    </div>

                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* 4. Sleek Call-To-Action Newsletter Form */}
                <div className="soon-newsletter-container max-w-[580px] mx-auto text-center bg-slate-950/50 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative">

                    {!isSubscribed ? (
                        <div className="animate-fade-in">
                            <div className="text-white text-md font-extrabold mb-2 uppercase tracking-widest">
                                Subscribe for Pre-Launch Offers
                            </div>
                            <p className="text-slate-400 text-xs mb-6">
                                Enter your email below. We'll send you updates, early-bird inspection waivers, and pre-launch booking discounts.
                            </p>

                            <form onSubmit={handleSubscribe} className="relative flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError('');
                                        }}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold text-white outline-none focus:border-dynamic-orange/50 focus:ring-1 focus:ring-dynamic-orange/20 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-dynamic-orange to-amber-accent py-3.5 px-6 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:opacity-95 shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Notify Me
                                            <Bell size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                            {emailError && (
                                <p className="text-red-500 text-[10px] font-bold text-left mt-2 pl-4">{emailError}</p>
                            )}
                        </div>
                    ) : (
                        <div className="animate-scale-in flex flex-col items-center py-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-4 animate-bounce">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="text-white text-md font-extrabold mb-2 uppercase tracking-widest">
                                You're on the list!
                            </div>
                            <p className="text-green-400 text-xs font-bold">
                                {email}
                            </p>
                            <p className="text-slate-400 text-xs max-w-[400px] mt-3">
                                Thank you for subscribing. We will notify you immediately once the marketplace dashboard and first listings go live.
                            </p>
                        </div>
                    )}
                </div>

                {/* 5. Re-designed Premium Features Grid */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-[850px] mx-auto">
                    {features.map((f, i) => (
                        <div key={i} className="soon-feature group bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center hover:bg-slate-900/70 hover:border-white/15 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-dynamic-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            
                            <div className="w-12 h-12 rounded-xl bg-dynamic-orange/10 border border-dynamic-orange/20 flex items-center justify-center mx-auto mb-4 text-dynamic-orange group-hover:scale-110 group-hover:bg-dynamic-orange/20 transition-all duration-300">
                                {f.icon}
                            </div>
                            <div className="text-white text-[0.85rem] font-extrabold mb-1.5">{f.title}</div>
                            <p className="text-slate-500 text-[0.7rem] leading-5">{f.desc}</p>
                        </div>
                    ))}
                </div> */}

            </div>



            {/* Coming Soon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#0f172a] border border-white/10 text-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl animate-scale-in text-center font-heading">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white font-bold transition-colors cursor-pointer border-none"
                        >
                            &times;
                        </button>

                        <div className="w-16 h-16 rounded-full bg-dynamic-orange/10 border border-dynamic-orange/20 flex items-center justify-center mx-auto mb-6 text-dynamic-orange animate-bounce">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <div className="text-xl font-bold text-white mb-2">{selectedService}</div>
                        <p className="text-dynamic-orange text-xs font-black tracking-widest uppercase mb-4">Coming Soon</p>

                        <p className="text-slate-400 text-sm leading-6 mb-6">
                            We are currently designing and preparing our premium <span className="text-white font-semibold">{selectedService}</span> platform. We'll be ready to launch this service for you very soon!
                        </p>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full py-3 bg-gradient-to-r from-dynamic-orange to-amber-accent text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:opacity-95 cursor-pointer border-none uppercase tracking-wider text-xs"
                        >
                            Awesome, Got It!
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
