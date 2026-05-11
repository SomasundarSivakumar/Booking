"use client";

import { Car, Bike, Bell, Phone, MapPin, ShoppingBag, Shield, FileCheck, CreditCard, Gauge } from "lucide-react";

export const ComingSoon = () => {
    const features = [
        { icon: <Shield size={20} strokeWidth={1.5} />, title: "Verified Vehicles", desc: "Every vehicle inspected & certified" },
        { icon: <FileCheck size={20} strokeWidth={1.5} />, title: "RC Transfer", desc: "Complete documentation assistance" },
        { icon: <CreditCard size={20} strokeWidth={1.5} />, title: "Easy EMI", desc: "Flexible financing options available" },
        { icon: <Gauge size={20} strokeWidth={1.5} />, title: "Best Prices", desc: "Market-competitive pricing guaranteed" },
    ];

    return (
        <section className="bg-gradient-to-b from-[#0f172a] to-[#1a2636] overflow-hidden font-heading text-slate-200">

            {/* ── Coming Soon Section ── */}
            <div className="relative py-32 overflow-hidden">
                {/* 3D Animation Keyframes */}
                <style>{`
                    @keyframes gridScroll {
                        0% { transform: perspective(400px) rotateX(65deg) translateY(0); }
                        100% { transform: perspective(400px) rotateX(65deg) translateY(50px); }
                    }
                    @keyframes floatCube {
                        0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                        25% { transform: translateY(-30px) rotateX(90deg) rotateY(45deg) rotateZ(20deg); }
                        50% { transform: translateY(-10px) rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
                        75% { transform: translateY(-40px) rotateX(270deg) rotateY(135deg) rotateZ(60deg); }
                    }
                    @keyframes orbitRing {
                        0% { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(0deg); }
                        100% { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(360deg); }
                    }
                    @keyframes floatSphere {
                        0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
                        50% { transform: translateY(-25px) scale(1.15); opacity: 1; }
                    }
                    @keyframes driftHorizontal {
                        0%, 100% { transform: translateX(0) translateY(0); }
                        50% { transform: translateX(30px) translateY(-15px); }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { opacity: 0.15; transform: scale(1); }
                        50% { opacity: 0.35; transform: scale(1.1); }
                    }
                `}</style>

                {/* 3D Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">

                    {/* Perspective Grid Floor */}
                    <div className="absolute bottom-0 left-[-50%] w-[200%] h-[60%] opacity-[0.12]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        animation: 'gridScroll 3s linear infinite',
                        transformOrigin: 'center bottom'
                    }} />

                    {/* Glowing orbs */}
                    <div className="absolute top-[15%] left-[8%] w-80 h-80 rounded-full blur-[120px]" style={{
                        background: 'radial-gradient(circle, rgba(255,107,53,0.12), transparent 70%)',
                        animation: 'pulseGlow 5s ease-in-out infinite'
                    }} />
                    <div className="absolute top-[30%] right-[5%] w-96 h-96 rounded-full blur-[140px]" style={{
                        background: 'radial-gradient(circle, rgba(70,130,180,0.1), transparent 70%)',
                        animation: 'pulseGlow 6s ease-in-out infinite 1.5s'
                    }} />
                    <div className="absolute bottom-[40%] left-[45%] w-64 h-64 rounded-full blur-[100px]" style={{
                        background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)',
                        animation: 'pulseGlow 7s ease-in-out infinite 3s'
                    }} />

                    {/* 3D Floating Cubes */}
                    {[
                        { size: 40, top: '12%', left: '15%', delay: '0s', dur: '12s', color: 'rgba(255,107,53,0.15)', border: 'rgba(255,107,53,0.3)' },
                        { size: 25, top: '25%', left: '80%', delay: '2s', dur: '15s', color: 'rgba(70,130,180,0.12)', border: 'rgba(70,130,180,0.25)' },
                        { size: 55, top: '60%', left: '8%',  delay: '4s', dur: '18s', color: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
                        { size: 30, top: '70%', left: '75%', delay: '1s', dur: '14s', color: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.25)' },
                        { size: 20, top: '40%', left: '90%', delay: '3s', dur: '16s', color: 'rgba(70,130,180,0.1)', border: 'rgba(70,130,180,0.2)' },
                        { size: 35, top: '18%', left: '55%', delay: '5s', dur: '13s', color: 'rgba(255,193,7,0.1)', border: 'rgba(255,193,7,0.2)' },
                    ].map((cube, i) => (
                        <div key={i} className="absolute" style={{
                            top: cube.top, left: cube.left,
                            width: cube.size, height: cube.size,
                            transformStyle: 'preserve-3d',
                            animation: `floatCube ${cube.dur} ease-in-out ${cube.delay} infinite`,
                        }}>
                            <div style={{
                                width: '100%', height: '100%',
                                background: cube.color,
                                border: `1px solid ${cube.border}`,
                                borderRadius: '6px',
                                backdropFilter: 'blur(4px)',
                                boxShadow: `0 0 20px ${cube.color}, inset 0 0 15px ${cube.color}`,
                            }} />
                        </div>
                    ))}

                    {/* Orbiting Rings */}
                    <div className="absolute top-[35%] left-[50%]" style={{
                        width: 300, height: 300,
                        animation: 'orbitRing 20s linear infinite',
                        transformStyle: 'preserve-3d',
                    }}>
                        <div style={{
                            width: '100%', height: '100%',
                            border: '1px solid rgba(255,107,53,0.1)',
                            borderRadius: '50%',
                            boxShadow: '0 0 30px rgba(255,107,53,0.05)',
                        }} />
                    </div>
                    <div className="absolute top-[30%] left-[48%]" style={{
                        width: 220, height: 220,
                        animation: 'orbitRing 15s linear reverse infinite',
                        transformStyle: 'preserve-3d',
                    }}>
                        <div style={{
                            width: '100%', height: '100%',
                            border: '1px solid rgba(70,130,180,0.1)',
                            borderRadius: '50%',
                            boxShadow: '0 0 25px rgba(70,130,180,0.05)',
                        }} />
                    </div>

                    {/* Floating Spheres */}
                    {[
                        { size: 8, top: '20%', left: '25%', delay: '0s', dur: '4s', color: '#FF6B35' },
                        { size: 5, top: '50%', left: '70%', delay: '1s', dur: '5s', color: '#4682B4' },
                        { size: 6, top: '75%', left: '30%', delay: '2s', dur: '4.5s', color: '#a855f7' },
                        { size: 4, top: '15%', left: '65%', delay: '0.5s', dur: '3.5s', color: '#FF6B35' },
                        { size: 7, top: '55%', left: '15%', delay: '1.5s', dur: '5.5s', color: '#4682B4' },
                        { size: 3, top: '35%', left: '85%', delay: '3s', dur: '4s', color: '#fbbf24' },
                        { size: 5, top: '80%', left: '60%', delay: '2.5s', dur: '6s', color: '#a855f7' },
                        { size: 4, top: '45%', left: '45%', delay: '1s', dur: '4.5s', color: '#FF6B35' },
                    ].map((s, i) => (
                        <div key={`sphere-${i}`} className="absolute rounded-full" style={{
                            width: s.size, height: s.size,
                            top: s.top, left: s.left,
                            background: s.color,
                            boxShadow: `0 0 ${s.size * 3}px ${s.color}80, 0 0 ${s.size * 6}px ${s.color}30`,
                            animation: `floatSphere ${s.dur} ease-in-out ${s.delay} infinite`,
                        }} />
                    ))}

                    {/* Horizontal drifting lines */}
                    {[
                        { top: '28%', w: 120, delay: '0s' },
                        { top: '62%', w: 80, delay: '2s' },
                        { top: '45%', w: 150, delay: '4s' },
                    ].map((line, i) => (
                        <div key={`line-${i}`} className="absolute left-[10%]" style={{
                            top: line.top,
                            width: line.w,
                            height: 1,
                            background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.2), transparent)',
                            animation: `driftHorizontal 8s ease-in-out ${line.delay} infinite`,
                        }} />
                    ))}
                </div>

                <div className="relative z-10 max-w-[85%] mx-auto">

                    {/* Top label */}
                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-dynamic-orange/20 blur-xl rounded-full" />
                            <span className="relative inline-flex items-center gap-2 text-[0.65rem] font-black tracking-[4px] uppercase px-6 py-2.5 rounded-full bg-gradient-to-r from-dynamic-orange/20 to-amber-accent/20 border border-dynamic-orange/30 text-dynamic-orange">
                                <span className="w-1.5 h-1.5 bg-dynamic-orange rounded-full animate-pulse" />
                                Launching Soon
                            </span>
                        </div>
                    </div>

                    {/* Main heading */}
                    <div className="text-center mb-16">
                        <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-white leading-[1.15] mb-5">
                            Second Hand
                            <br />
                            <span className="bg-gradient-to-r from-dynamic-orange via-amber-accent to-dynamic-orange bg-clip-text text-transparent">Cars</span>
                            {" & "}
                            <span className="bg-gradient-to-r from-steel-blue via-blue-400 to-steel-blue bg-clip-text text-transparent">Bikes</span>
                            {" "}Marketplace
                        </h2>
                        <p className="text-slate-400 text-[1.05rem] leading-8 max-w-[550px] mx-auto">
                            A trusted platform to buy & sell pre-owned vehicles. Inspected, documented, and priced fairly — launching for you very soon.
                        </p>
                    </div>

                    {/* Vehicle showcase cards */}
                    <div className="flex justify-center gap-8 mb-16">
                        {/* Car card */}
                        <div className="group relative w-[280px]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-dynamic-orange to-amber-accent rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative bg-[#0c1525] rounded-2xl border border-white/[0.08] overflow-hidden hover:border-dynamic-orange/30 transition-all duration-500">
                                <div className="relative h-[160px] overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
                                        alt="Used Cars"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1525] via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-dynamic-orange flex items-center justify-center">
                                            <Car size={16} className="text-white" />
                                        </div>
                                        <span className="text-white font-bold text-sm">Used Cars</span>
                                    </div>
                                </div>
                                <div className="p-4 pt-2">
                                    <p className="text-slate-400 text-xs leading-5 mb-3">Sedans, SUVs, Hatchbacks — every car inspected & certified.</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Sedan', 'SUV', 'Hatchback'].map(t => (
                                            <span key={t} className="text-[0.6rem] font-bold text-dynamic-orange bg-dynamic-orange/10 border border-dynamic-orange/20 px-2.5 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bike card */}
                        <div className="group relative w-[280px]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-steel-blue to-blue-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative bg-[#0c1525] rounded-2xl border border-white/[0.08] overflow-hidden hover:border-steel-blue/30 transition-all duration-500">
                                <div className="relative h-[160px] overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                                        alt="Used Bikes"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1525] via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-steel-blue flex items-center justify-center">
                                            <Bike size={16} className="text-white" />
                                        </div>
                                        <span className="text-white font-bold text-sm">Used Bikes</span>
                                    </div>
                                </div>
                                <div className="p-4 pt-2">
                                    <p className="text-slate-400 text-xs leading-5 mb-3">Cruisers, Sports, Scooters — with full service history.</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Cruiser', 'Sports', 'Scooter'].map(t => (
                                            <span key={t} className="text-[0.6rem] font-bold text-steel-blue bg-steel-blue/10 border border-steel-blue/20 px-2.5 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-[750px] mx-auto">
                        {features.map((f, i) => (
                            <div key={i} className="group bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-dynamic-orange/10 border border-dynamic-orange/15 flex items-center justify-center mx-auto mb-3 text-dynamic-orange group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h4 className="text-white text-[0.78rem] font-bold mb-1">{f.title}</h4>
                                <p className="text-slate-500 text-[0.65rem] leading-4">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-dynamic-orange to-amber-accent rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                            <button className="relative inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-gradient-to-r from-dynamic-orange to-amber-accent text-white text-[0.85rem] font-black border-none cursor-pointer hover:-translate-y-0.5 transition-all uppercase tracking-[2px]">
                                <Bell size={16} strokeWidth={2.5} />
                                Notify Me
                            </button>
                        </div>
                        <p className="text-slate-600 text-xs">Be the first to know when we launch.</p>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="bg-[#0b1120] pt-24 pb-12 px-5 border-t border-white/5">
                <div className="max-w-[90%] mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1.5">
                            <div className="flex flex-col mb-6">
                                <span className="font-heading text-2xl font-extrabold tracking-tighter text-white leading-none">
                                    PRAKASH <span className="text-amber-accent">TRAVEL</span>
                                </span>
                                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gray-400 font-bold mt-1">
                                    Premium Mobility Solutions
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-7 mb-8 max-w-[300px]">
                                Your trusted partner for premium travel experiences in Tamil Nadu. Reliable, verified, and affordable cab services.
                            </p>
                            <div className="flex gap-4">
                                {['fb', 'tw', 'ig', 'li'].map(social => (
                                    <div key={social} className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-dynamic-orange hover:border-dynamic-orange transition-all group">
                                        <div className="w-4 h-4 bg-slate-400 group-hover:bg-white rounded-[2px]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-slate-500 text-sm font-medium">
                                {['Home', 'Fleet', 'Booking', 'Contact'].map(link => (
                                    <li key={link} className="hover:text-amber-accent transition-colors cursor-pointer">{link}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Services</h4>
                            <ul className="space-y-4 text-slate-500 text-sm font-medium">
                                {['Car Rental', 'Taxi Service', 'Airport Transfer', 'Outstation Trips'].map(link => (
                                    <li key={link} className="hover:text-amber-accent transition-colors cursor-pointer">{link}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact Us</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone size={14} className="text-dynamic-orange mt-1 shrink-0" />
                                    <p className="text-slate-500 text-sm">+91 98765 43210</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShoppingBag size={14} className="text-steel-blue mt-1 shrink-0" />
                                    <p className="text-slate-500 text-sm">contact@prakashtravels.com</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={14} className="text-dynamic-orange mt-1 shrink-0" />
                                    <p className="text-slate-500 text-sm">Main Market St, Chennai, Tamil Nadu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
                        <p className="text-slate-600 text-xs font-medium">
                            &copy; {new Date().getFullYear()} Prakash Travels. All rights reserved.
                        </p>
                        <div className="flex gap-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
                            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
                            <span className="hover:text-slate-400 cursor-pointer">Cookie Policy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
};
