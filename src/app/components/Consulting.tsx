"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    Car, Bike, CalendarDays, Gauge, Fuel, MapPin, Tag,
    BadgeCheck, FileCheck, Receipt, CreditCard, ChevronRight,
    PlusCircle, TrendingUp, Users, LayoutGrid, ShoppingBag, Phone
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const listings = {
    cars: [
        { id: 1, name: "Honda City 2020", price: "₹7,50,000", year: 2020, km: "32,000 km", fuel: "Petrol", tag: "Best Deal", tagColor: "#FF6B35", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80" },
        { id: 2, name: "Maruti Swift 2021", price: "₹5,20,000", year: 2021, km: "18,000 km", fuel: "Petrol", tag: "Low Mileage", tagColor: "#22c55e", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80" },
        { id: 3, name: "Toyota Innova 2019", price: "₹13,80,000", year: 2019, km: "55,000 km", fuel: "Diesel", tag: "Family Pick", tagColor: "#4682B4", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80" },
    ],
    bikes: [
        { id: 1, name: "Royal Enfield Classic", price: "₹1,40,000", year: 2021, km: "12,000 km", fuel: "Petrol", tag: "Top Pick", tagColor: "#FF6B35", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
        { id: 2, name: "KTM Duke 200", price: "₹95,000", year: 2020, km: "22,000 km", fuel: "Petrol", tag: "Sports", tagColor: "#a855f7", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
        { id: 3, name: "Honda Activa 6G", price: "₹58,000", year: 2022, km: "8,000 km", fuel: "Petrol", tag: "Like New", tagColor: "#22c55e", image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80" },
    ],
};

const features = [
    { icon: <BadgeCheck size={15} strokeWidth={1.75} />, label: "Verified Sellers & Buyers" },
    { icon: <FileCheck size={15} strokeWidth={1.75} />, label: "RC Transfer Assistance" },
    { icon: <Receipt size={15} strokeWidth={1.75} />, label: "Free Inspection Report" },
    { icon: <CreditCard size={15} strokeWidth={1.75} />, label: "Easy EMI Options" },
];

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ item, accentClass, gradientClass, onViewClick }: {
    item: typeof listings.cars[0];
    accentClass: string;
    gradientClass: string;
    onViewClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`bg-white/[0.04] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border
        ${hovered ? "border-white/20 -translate-y-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]" : "border-white/[0.07]"}`}
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                <img src={item.image} alt={item.name}
                    className={`w-full h-[110px] object-cover block transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`} />
                <span className="absolute top-2 left-2 text-[0.62rem] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm border"
                    style={{ background: `${item.tagColor}22`, color: item.tagColor, borderColor: `${item.tagColor}44` }}>
                    {item.tag}
                </span>
            </div>

            {/* Body */}
            <div className="p-3">
                <h3 className="text-slate-200 text-[0.82rem] font-bold mb-1">{item.name}</h3>
                <p className={`text-[0.95rem] font-extrabold mb-2 ${accentClass}`}>{item.price}</p>
                <div className="flex flex-wrap gap-1 mb-2.5">
                    {[
                        { icon: <CalendarDays size={10} strokeWidth={1.75} />, label: item.year },
                        { icon: <Gauge size={10} strokeWidth={1.75} />, label: item.km },
                        { icon: <Fuel size={10} strokeWidth={1.75} />, label: item.fuel },
                    ].map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[0.62rem] text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
                            {m.icon} {m.label}
                        </span>
                    ))}
                </div>
                <button onClick={onViewClick}
                    className={`w-full py-1.5 flex items-center justify-center gap-1.5 rounded-lg border-none text-white text-[0.72rem] font-bold cursor-pointer hover:opacity-90 transition-opacity ${gradientClass}`}>
                    View Details <ChevronRight size={12} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({ title, subtitle, description, items, imageUrl, imageAlt, reverse, accentClass, badgeBg, gradientClass, badgeColor, onExploreClick, onCardClick, icon }: {
    title: string; subtitle: string; description: string;
    items: typeof listings.cars; imageUrl: string; imageAlt: string;
    reverse: boolean; accentClass: string; badgeBg: string; gradientClass: string; badgeColor: string;
    onExploreClick: () => void; onCardClick: () => void; icon: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.12 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`grid gap-14 items-start transition-all duration-700
        ${reverse ? "md:grid-cols-[1fr_1fr] [direction:rtl]" : "md:grid-cols-[1fr_1fr]"}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
            {/* Image Panel */}
            <div className={`flex flex-col gap-4 ${reverse ? "[direction:ltr]" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] group">
                    <img src={imageUrl} alt={imageAlt}
                        className="w-full h-[310px] object-cover block transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/20" />
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${gradientClass.replace("bg-gradient-to-r", "bg-gradient-to-b")}`} />
                    {/* Badge */}
                    <span className={`absolute bottom-3.5 right-3.5 ${badgeColor} text-white text-[0.78rem] font-bold px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]`}>
                        {items.length}+ Listings
                    </span>
                </div>

                {/* Quick preview chips */}
                <div className="flex gap-3">
                    {items.slice(0, 2).map(item => (
                        <div key={item.id} className="flex-1 flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 hover:bg-white/[0.07] transition-colors overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[0.75rem] text-slate-200 font-semibold mb-0.5 truncate">{item.name}</p>
                                <p className={`text-[0.8rem] font-extrabold ${accentClass}`}>{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Panel */}
            <div className={`flex flex-col gap-5 ${reverse ? "[direction:ltr]" : ""}`}>
                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 text-[0.75rem] font-bold tracking-[1.8px] uppercase border rounded-full px-3.5 py-1.5 w-fit ${badgeBg} ${accentClass}`}>
                    {icon} {subtitle}
                </span>

                <h2 className="text-[clamp(1.5rem,2.5vw,2.1rem)] font-extrabold text-white leading-tight">{title}</h2>
                <p className="text-slate-400 text-[0.95rem] leading-7">{description}</p>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 list-none p-0 m-0">
                    {features.map((f, i) => (
                        <li key={i} className={`flex items-center gap-2 text-[0.85rem] font-medium ${accentClass}`}>
                            {f.icon}
                            <span className="text-slate-300">{f.label}</span>
                        </li>
                    ))}
                </ul>

                {/* Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {items.map(item => (
                        <ListingCard key={item.id} item={item} accentClass={accentClass} gradientClass={gradientClass} onViewClick={onCardClick} />
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-wrap">
                    <button onClick={onExploreClick}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border-none text-white text-[0.9rem] font-bold cursor-pointer shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(0,0,0,0.4)] transition-all ${gradientClass}`}>
                        <LayoutGrid size={16} strokeWidth={1.75} />
                        Explore All {subtitle}
                    </button>
                    <button onClick={onExploreClick}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-transparent text-slate-200 text-[0.9rem] font-semibold cursor-pointer hover:bg-white/[0.06] hover:border-white/35 hover:-translate-y-0.5 transition-all">
                        <PlusCircle size={16} strokeWidth={1.75} />
                        Post a Free Ad
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export const Consulting = () => {
    const router = useRouter();
    const toCars = () => router.push("/consulting/cars");
    const toBikes = () => router.push("/consulting/bikes");

    return (
        <section className="bg-gradient-to-b from-[#0f172a] to-[#1a2636] pt-12 overflow-hidden font-heading text-slate-200">

            {/* ── Section Blocks ── */}
            <div className="max-w-[90%] mx-auto flex flex-col gap-24">

                <SectionBlock
                    title="Find Your Perfect Pre-Owned Car"
                    subtitle="Used Cars"
                    description="Browse hundreds of certified second-hand cars across all budgets. Sedans, SUVs, hatchbacks — every car is inspected, documented, and priced fairly."
                    items={listings.cars}
                    imageUrl="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80"
                    imageAlt="Second hand cars"
                    reverse={false}
                    accentClass="text-dynamic-orange"
                    badgeBg="bg-dynamic-orange/[0.12] border-dynamic-orange/30"
                    badgeColor="bg-dynamic-orange"
                    gradientClass="bg-gradient-to-r from-dynamic-orange to-amber-accent"
                    icon={<Car size={13} strokeWidth={1.75} />}
                    onExploreClick={toCars}
                    onCardClick={toCars}
                />

                {/* Divider */}
                <div className="flex items-center gap-5">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm px-5 py-2 border border-white/[0.07] rounded-full bg-white/[0.02] whitespace-nowrap">
                        <Bike size={14} strokeWidth={1.75} />
                        Also Explore
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <SectionBlock
                    title="Ride Smart with Pre-Owned Bikes"
                    subtitle="Used Bikes"
                    description="From powerful cruisers to fuel-efficient scooters, explore a wide range of verified second-hand bikes. Every listing includes service history and inspection details."
                    items={listings.bikes}
                    imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
                    imageAlt="Second hand bikes"
                    reverse={true}
                    accentClass="text-steel-blue"
                    badgeBg="bg-steel-blue/[0.12] border-steel-blue/30"
                    badgeColor="bg-steel-blue"
                    gradientClass="bg-gradient-to-r from-steel-blue to-primary"
                    icon={<Bike size={13} strokeWidth={1.75} />}
                    onExploreClick={toBikes}
                    onCardClick={toBikes}
                />
            </div>

            {/* ── Contact Section ── */}
            <div id="contact" className="max-w-[90%] mx-auto mt-32 mb-32">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block text-dynamic-orange font-bold tracking-[2px] uppercase text-[0.75rem] mb-4">Contact Us</span>
                        <h2 className="text-[2.5rem] font-extrabold text-white mb-6 leading-tight">Get in Touch with Our Experts</h2>
                        <p className="text-slate-400 text-[1rem] leading-7 mb-10">
                            Have questions about a listing or want to sell your vehicle? Our team is here to help you every step of the way. Send us a message and we'll get back to you shortly.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <Phone className="text-dynamic-orange" />, title: "Call Us", detail: "+91 98765 43210" },
                                { icon: <ShoppingBag className="text-steel-blue" />, title: "Email Us", detail: "contact@prakashtravels.com" },
                                { icon: <MapPin className="text-dynamic-orange" />, title: "Our Location", detail: "Main Market St, Chennai, Tamil Nadu" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-wide">{item.title}</h4>
                                        <p className="text-slate-400 text-sm mt-1">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-dynamic-orange/10 blur-[80px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-steel-blue/10 blur-[80px] rounded-full" />
                        
                        <form className="relative z-10 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dynamic-orange transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                    <input type="email" placeholder="john@example.com" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-steel-blue transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                                <select className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dynamic-orange transition-colors">
                                    <option>Inquiry about a Car</option>
                                    <option>Inquiry about a Bike</option>
                                    <option>Sell my Vehicle</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Message</label>
                                <textarea rows={4} placeholder="Tell us more about your needs..." className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dynamic-orange transition-colors resize-none" />
                            </div>
                            <button className="w-full py-4 bg-gradient-to-r from-dynamic-orange to-amber-accent text-white font-black uppercase tracking-widest text-[0.8rem] rounded-xl hover:shadow-[0_10px_30px_rgba(255,107,53,0.3)] transition-all active:scale-[0.98]">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Bottom CTA Banner ── */}
            <div className="relative bg-gradient-to-br from-dynamic-orange via-amber-accent to-steel-blue py-20 px-5 text-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                <div className="relative z-10 max-w-[640px] mx-auto">
                    <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold text-white mb-3.5">
                        Ready to Sell Your Vehicle?
                    </h2>
                    <p className="text-white/80 text-base mb-8 leading-7">
                        List your car or bike for free. Reach thousands of verified buyers in your city today.
                    </p>

                    <div className="flex gap-3.5 justify-center flex-wrap mb-7">
                        <button onClick={toCars}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-dynamic-orange text-[0.95rem] font-extrabold rounded-xl border-none cursor-pointer shadow-[0_6px_24px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all">
                            <Car size={17} strokeWidth={1.75} /> Sell My Car
                        </button>
                        <button onClick={toBikes}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white text-[0.95rem] font-bold rounded-xl border-2 border-white/60 cursor-pointer hover:bg-white/15 hover:-translate-y-1 transition-all">
                            <Bike size={17} strokeWidth={1.75} /> Sell My Bike
                        </button>
                    </div>

                    <div className="flex justify-center gap-8 flex-wrap border-t border-white/10 pt-8 mt-4">
                        {[
                            { icon: <BadgeCheck size={14} />, label: "Verified Listings" },
                            { icon: <Tag size={14} />, label: "Best Prices" },
                            { icon: <Users size={14} />, label: "10K+ Sellers" },
                        ].map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 text-white font-bold text-[0.8rem] uppercase tracking-widest">
                                {t.icon} {t.label}
                            </span>
                        ))}
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
                                Your trusted partner for high-quality used vehicles and premium travel experiences in Tamil Nadu. Verified, reliable, and affordable.
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
                                {['Home', 'Fleet', 'Booking', 'Used Cars', 'Used Bikes'].map(link => (
                                    <li key={link} className="hover:text-amber-accent transition-colors cursor-pointer">{link}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Services</h4>
                            <ul className="space-y-4 text-slate-500 text-sm font-medium">
                                {['Car Rental', 'Taxi Service', 'Marketplace', 'Inspection', 'Insurance'].map(link => (
                                    <li key={link} className="hover:text-amber-accent transition-colors cursor-pointer">{link}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Get Updates</h4>
                            <p className="text-slate-500 text-sm mb-6">Subscribe to get the latest listings and travel deals.</p>
                            <div className="flex flex-col gap-3">
                                <input type="email" placeholder="Email Address" className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dynamic-orange transition-colors" />
                                <button className="w-full py-3 bg-white text-[#0b1120] font-black uppercase tracking-widest text-[0.7rem] rounded-xl hover:bg-amber-accent transition-all">
                                    Subscribe
                                </button>
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
