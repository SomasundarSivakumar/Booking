"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  MapPin, Wallet, Tag, CalendarDays, Fuel, Search, SlidersHorizontal,
  ChevronDown, User, Clock3, Heart, X, PlusCircle, ArrowLeft, Bike,
  Gauge, ArrowUpDown, Phone, Sparkles, BadgeCheck
} from "lucide-react";
import { LocationSearch } from '@/app/components/LocationSearch';
import VehicleDetailModal from '@/app/components/VehicleDetailModal';

// ─── Data ─────────────────────────────────────────────────────────────────────
const allBikes = [
  { id: 1, name: "Royal Enfield Classic 350", brand: "Royal Enfield", price: 140000, priceLabel: "₹1,40,000", year: 2021, km: "12,000 km", fuel: "Petrol", tag: "Top Pick", location: "Chennai", seller: "Rajesh K", posted: "2 days ago", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" },
  { id: 2, name: "KTM Duke 200", brand: "KTM", price: 95000, priceLabel: "₹95,000", year: 2020, km: "22,000 km", fuel: "Petrol", tag: "Sports", location: "Coimbatore", seller: "Arjun S", posted: "5 days ago", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=700&q=80" },
  { id: 3, name: "Honda Activa 6G", brand: "Honda", price: 58000, priceLabel: "₹58,000", year: 2022, km: "8,000 km", fuel: "Petrol", tag: "Like New", location: "Madurai", seller: "Priya M", posted: "1 day ago", image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=700&q=80" },
  { id: 4, name: "Yamaha R15 V4", brand: "Yamaha", price: 120000, priceLabel: "₹1,20,000", year: 2022, km: "15,000 km", fuel: "Petrol", tag: "Racing", location: "Salem", seller: "Vijay T", posted: "3 days ago", image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=700&q=80" },
  { id: 5, name: "Bajaj Pulsar NS200", brand: "Bajaj", price: 78000, priceLabel: "₹78,000", year: 2020, km: "30,000 km", fuel: "Petrol", tag: "Popular", location: "Trichy", seller: "Kumar R", posted: "Today", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&q=80" },
  { id: 6, name: "TVS Apache RTR 200", brand: "TVS", price: 85000, priceLabel: "₹85,000", year: 2021, km: "19,000 km", fuel: "Petrol", tag: "Verified", location: "Chennai", seller: "Suresh A", posted: "4 days ago", image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=700&q=80" },
  { id: 7, name: "Royal Enfield Meteor 350", brand: "Royal Enfield", price: 165000, priceLabel: "₹1,65,000", year: 2022, km: "10,000 km", fuel: "Petrol", tag: "Premium", location: "Coimbatore", seller: "Deepak R", posted: "1 week ago", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" },
  { id: 8, name: "Honda CB Shine", brand: "Honda", price: 48000, priceLabel: "₹48,000", year: 2020, km: "25,000 km", fuel: "Petrol", tag: "Best Deal", location: "Erode", seller: "Siva K", posted: "6 days ago", image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=700&q=80" },
  { id: 9, name: "Yamaha FZ-S V3", brand: "Yamaha", price: 72000, priceLabel: "₹72,000", year: 2021, km: "18,000 km", fuel: "Petrol", tag: "Popular", location: "Madurai", seller: "Arun P", posted: "2 days ago", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&q=80" },
  { id: 10, name: "Bajaj Dominar 400", brand: "Bajaj", price: 135000, priceLabel: "₹1,35,000", year: 2021, km: "20,000 km", fuel: "Petrol", tag: "Top Pick", location: "Trichy", seller: "Mani V", posted: "3 days ago", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=700&q=80" },
  { id: 11, name: "TVS Jupiter", brand: "TVS", price: 42000, priceLabel: "₹42,000", year: 2021, km: "14,000 km", fuel: "Petrol", tag: "Like New", location: "Salem", seller: "Priya N", posted: "5 days ago", image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=700&q=80" },
  { id: 12, name: "KTM RC 200", brand: "KTM", price: 115000, priceLabel: "₹1,15,000", year: 2020, km: "28,000 km", fuel: "Petrol", tag: "Sports", location: "Chennai", seller: "Ganesh M", posted: "Today", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=700&q=80" },
];

const brands = [...new Set(allBikes.map(b => b.brand))];
const locations = [...new Set(allBikes.map(b => b.location))];
const years = [...new Set(allBikes.map(b => b.year))].sort((a, b) => b - a);

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹50K", min: 0, max: 50000 },
  { label: "₹50K – ₹1 Lakh", min: 50000, max: 100000 },
  { label: "₹1 – ₹1.5 Lakh", min: 100000, max: 150000 },
  { label: "Above ₹1.5 Lakh", min: 150000, max: Infinity },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Year: Newest First", value: "year_desc" },
  { label: "Year: Oldest First", value: "year_asc" },
];

const tagColors: Record<string, string> = {
  "Top Pick": "#4682B4", Sports: "#a855f7", "Like New": "#22c55e",
  Racing: "#ef4444", Popular: "#FFB703", Verified: "#22c55e",
  Premium: "#4682B4", "Best Deal": "#FF6B35",
};

// ─── Shared Components ────────────────────────────────────────────────────────

const SortDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = sortOptions.find(o => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0 select-none">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2a3a] border border-white/10 rounded-xl text-slate-200 text-sm font-semibold cursor-pointer min-w-[200px] hover:border-white/20 transition-colors"
      >
        <ArrowUpDown size={15} className="text-steel-blue shrink-0" strokeWidth={1.75} />
        <span className="flex-1 text-left">{current?.label}</span>
        <ChevronDown size={14} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-primary border border-white/10 rounded-xl overflow-hidden z-50 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {sortOptions.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 border-none text-sm flex items-center gap-2 transition-colors cursor-pointer
                ${opt.value === value ? "bg-steel-blue/10 text-steel-blue font-bold" : "bg-transparent text-slate-200 font-normal hover:bg-white/5"}`}>
              {opt.value === value && <span className="text-steel-blue text-xs">●</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSidebar({
  selectedBrands, setSelectedBrands,
  selectedLocations, setSelectedLocations,
  selectedYears, setSelectedYears,
  selectedPriceRange, setSelectedPriceRange,
  activeFilterCount, clearAll,
}: {
  selectedBrands: string[]; setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocations: string[]; setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedYears: number[]; setSelectedYears: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPriceRange: number; setSelectedPriceRange: React.Dispatch<React.SetStateAction<number>>;
  activeFilterCount: number; clearAll: () => void;
}) {
  const toggleArr = <V,>(arr: V[], val: V, set: React.Dispatch<React.SetStateAction<V[]>>) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const Section = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="mb-1">
        <button onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 py-2.5 bg-transparent border-none cursor-pointer text-slate-400 font-bold text-[0.72rem] tracking-widest uppercase">
          <span className="text-steel-blue flex">{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          <ChevronDown size={14} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="pb-4">{children}</div>}
        <div className="h-px bg-white/[0.06] mb-1" />
      </div>
    );
  };

  const CheckRow = ({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${checked ? "bg-steel-blue/[0.07]" : "hover:bg-white/[0.04]"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <span className={`w-[18px] h-[18px] rounded-md shrink-0 flex items-center justify-center transition-all border-2 ${checked ? "bg-steel-blue border-steel-blue" : "bg-transparent border-white/20"}`}>
        {checked && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span className={`flex-1 text-sm ${checked ? "text-slate-200 font-semibold" : "text-slate-400 font-normal"}`}>{label}</span>
      <span className="text-[0.7rem] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
    </label>
  );

  const RadioRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${checked ? "bg-steel-blue/[0.07]" : "hover:bg-white/[0.04]"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="hidden" />
      <span className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center transition-all border-2 ${checked ? "border-steel-blue" : "border-white/20"}`}>
        {checked && <span className="w-2 h-2 rounded-full bg-steel-blue" />}
      </span>
      <span className={`text-sm ${checked ? "text-slate-200 font-semibold" : "text-slate-400 font-normal"}`}>{label}</span>
    </label>
  );

  return (
    <div className="bg-[#10192a] rounded-2xl p-5 border border-white/[0.07]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-steel-blue" strokeWidth={1.75} />
          <span className="text-white font-extrabold text-base">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-steel-blue text-white text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="bg-transparent border border-white/10 text-slate-400 px-3 py-1 rounded-md cursor-pointer text-xs hover:text-slate-200 hover:border-white/25 transition-colors">
            Clear All
          </button>
        )}
      </div>

      <Section icon={<MapPin size={15} strokeWidth={1.75} />} label="Location">
        {locations.map(loc => (
          <CheckRow key={loc} label={loc} count={allBikes.filter(b => b.location === loc).length}
            checked={selectedLocations.includes(loc)} onChange={() => toggleArr(selectedLocations, loc, setSelectedLocations)} />
        ))}
      </Section>
      <Section icon={<Wallet size={15} strokeWidth={1.75} />} label="Budget">
        {priceRanges.map((range, i) => (
          <RadioRow key={i} label={range.label} checked={selectedPriceRange === i} onChange={() => setSelectedPriceRange(i)} />
        ))}
      </Section>
      <Section icon={<Tag size={15} strokeWidth={1.75} />} label="Brand">
        {brands.map(brand => (
          <CheckRow key={brand} label={brand} count={allBikes.filter(b => b.brand === brand).length}
            checked={selectedBrands.includes(brand)} onChange={() => toggleArr(selectedBrands, brand, setSelectedBrands)} />
        ))}
      </Section>
      <Section icon={<CalendarDays size={15} strokeWidth={1.75} />} label="Year">
        <div className="flex flex-wrap gap-2 pt-1">
          {years.map(year => {
            const active = selectedYears.includes(year);
            return (
              <button key={year} onClick={() => toggleArr(selectedYears, year, setSelectedYears)}
                className={`px-4 py-1.5 rounded-lg border text-sm cursor-pointer transition-all font-medium
                  ${active ? "border-steel-blue bg-steel-blue/10 text-steel-blue font-bold" : "border-white/10 bg-transparent text-slate-400 hover:border-white/25"}`}>
                {year}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Chip({ label, icon, onRemove }: { label: string; icon: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-steel-blue/10 border border-steel-blue/30 rounded-full text-[0.78rem] text-steel-blue font-semibold">
      {icon} {label}
      <button onClick={onRemove} className="bg-transparent border-none text-steel-blue cursor-pointer flex p-0 ml-0.5 hover:opacity-70 transition-opacity">
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

function BikeCard({ bike, faved, onFav, onClick }: { bike: typeof allBikes[0]; faved: boolean; onFav: () => void; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const tagColor = tagColors[bike.tag] ?? "#4682B4";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-[#1a2a3a] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border
        ${hovered ? "border-steel-blue/40 -translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]" : "border-white/[0.07]"}`}
    >
      <div className="relative overflow-hidden">
        <img src={bike.image} alt={bike.name}
          className={`w-full h-[190px] object-cover block transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`} />
        <span className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold px-3 py-1 rounded-full backdrop-blur-sm border"
          style={{ background: `${tagColor}20`, color: tagColor, borderColor: `${tagColor}44` }}>
          {bike.tag}
        </span>
        <button onClick={e => { e.stopPropagation(); onFav(); }}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer transition-all
            ${faved ? "bg-steel-blue/90" : "bg-black/55 backdrop-blur-sm hover:bg-black/70"}`}>
          <Heart size={15} strokeWidth={1.75} className="text-white" />
        </button>
        <div className="absolute inset-0 bg-steel-blue/0 hover:bg-steel-blue/5 transition-colors duration-200" />
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[0.68rem] text-slate-400 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
          <Clock3 size={11} strokeWidth={1.75} /> {bike.posted}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-white text-[0.95rem] font-bold mb-1">{bike.name}</h3>
        <p className="text-steel-blue text-xl font-extrabold mb-3">{bike.priceLabel}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { icon: <CalendarDays size={11} strokeWidth={1.75} />, label: bike.year },
            { icon: <Gauge size={11} strokeWidth={1.75} />, label: bike.km },
            { icon: <Fuel size={11} strokeWidth={1.75} />, label: bike.fuel },
          ].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[0.7rem] text-slate-400 bg-white/[0.05] px-2.5 py-0.5 rounded-full">
              {m.icon} {m.label}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2.5 mb-3 border-t border-white/[0.07]">
          <span className="flex items-center gap-1 text-[0.75rem] text-slate-400"><MapPin size={12} strokeWidth={1.75} /> {bike.location}</span>
          <span className="flex items-center gap-1 text-[0.75rem] text-slate-400"><User size={12} strokeWidth={1.75} /> {bike.seller}</span>
        </div>
        <button className="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg border-none text-white text-sm font-bold cursor-pointer bg-gradient-to-r from-steel-blue to-primary hover:opacity-90 transition-opacity">
          <Phone size={14} strokeWidth={2} /> Contact Seller
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BikesListingPage() {
  const router = useRouter();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favs, setFavs] = useState<number[]>([]);
  const [selectedBike, setSelectedBike] = useState<typeof allBikes[0] | null>(null);

  const clearAll = () => { setSelectedBrands([]); setSelectedLocations([]); setSelectedYears([]); setSelectedPriceRange(0); setQuery(""); };
  const activeFilterCount = selectedBrands.length + selectedLocations.length + selectedYears.length + (selectedPriceRange > 0 ? 1 : 0);

  const filtered = useMemo(() => {
    let r = [...allBikes];
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(b => b.name.toLowerCase().includes(q) || b.brand.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)); }
    if (selectedBrands.length) r = r.filter(b => selectedBrands.includes(b.brand));
    if (selectedLocations.length) r = r.filter(b => selectedLocations.includes(b.location));
    if (selectedYears.length) r = r.filter(b => selectedYears.includes(b.year));
    const range = priceRanges[selectedPriceRange];
    r = r.filter(b => b.price >= range.min && b.price < range.max);
    switch (sortBy) {
      case "price_asc": r.sort((a, b) => a.price - b.price); break;
      case "price_desc": r.sort((a, b) => b.price - a.price); break;
      case "year_desc": r.sort((a, b) => b.year - a.year); break;
      case "year_asc": r.sort((a, b) => a.year - b.year); break;
    }
    return r;
  }, [query, selectedBrands, selectedLocations, selectedYears, selectedPriceRange, sortBy]);

  const sidebarProps = { selectedBrands, setSelectedBrands, selectedLocations, setSelectedLocations, selectedYears, setSelectedYears, selectedPriceRange, setSelectedPriceRange, activeFilterCount, clearAll };

  return (
    <div className="min-h-screen bg-[#152030] font-heading text-slate-200">

      {/* Search Header */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 px-7 py-4 bg-primary border-b border-white/[0.07]">
        <div className="flex items-center gap-3 shrink-0 mr-2">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-2 bg-steel-blue/10 border border-steel-blue/20 rounded-xl">
            <Bike size={18} className="text-steel-blue" />
            <span className="text-[0.75rem] font-black uppercase tracking-widest text-white whitespace-nowrap">Bikes Listing</span>
          </div>
        </div>

        <LocationSearch 
          value={selectedLocations[0] || ""}
          onChange={(loc) => setSelectedLocations(loc ? [loc] : [])}
          accentColor="steel-blue"
          placeholder="Search Location..."
        />

        <div className="flex-1 flex items-center gap-2.5 bg-white/[0.08] border border-white/20 rounded-xl px-4 py-2.5 focus-within:border-steel-blue/60 transition-colors group">
          <Search size={18} strokeWidth={2.5} className="text-slate-400 shrink-0 group-focus-within:text-steel-blue" />
          <input
            type="text"
            placeholder="Find Bikes, Brands and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-slate-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-steel-blue to-primary border-none rounded-xl text-white font-bold text-sm cursor-pointer hover:shadow-[0_8px_20px_rgba(70,130,180,0.3)] transition-all active:scale-[0.98] shrink-0">
            <PlusCircle size={17} strokeWidth={2.5} />
            Post Ad
          </button>
        </div>

        <button onClick={() => setMobileOpen(o => !o)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-[#1a2a3a] border border-white/[0.07] rounded-xl text-slate-200 text-sm font-semibold cursor-pointer"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
        
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0">
          <FilterSidebar {...sidebarProps} />
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/70 z-[300] flex backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className="ml-auto w-[320px] max-w-[85vw] bg-[#10192a] overflow-y-auto p-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="font-extrabold text-white text-lg">Filters</span>
                <button onClick={() => setMobileOpen(false)} className="bg-white/[0.07] border-none text-slate-200 p-2 rounded-lg cursor-pointer">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              <FilterSidebar {...sidebarProps} />
              <button 
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 mt-6 bg-gradient-to-r from-steel-blue to-primary border-none rounded-xl text-white font-extrabold text-base">
                Show Results
              </button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black mb-1">Pre-owned <span className="text-steel-blue">Bikes</span></h1>
              <p className="text-slate-500 text-sm font-medium">Found {filtered.length} verified listings in your area</p>
            </div>
          </div>

          {/* Detail Modal */}
          <VehicleDetailModal
            vehicle={selectedBike}
            accentColor="steel-blue"
            onClose={() => setSelectedBike(null)}
            faved={selectedBike ? favs.includes(selectedBike.id) : false}
            onFav={() => selectedBike && setFavs(f => f.includes(selectedBike.id) ? f.filter(x => x !== selectedBike.id) : [...f, selectedBike.id])}
          />

          {filtered.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {filtered.map(bike => (
                <BikeCard key={bike.id} bike={bike}
                  faved={favs.includes(bike.id)}
                  onFav={() => setFavs(f => f.includes(bike.id) ? f.filter(x => x !== bike.id) : [...f, bike.id])}
                  onClick={() => setSelectedBike(bike)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-[#1e2f42] rounded-3xl border border-dashed border-white/10">
              <div className="w-20 h-20 bg-steel-blue/10 rounded-full flex items-center justify-center mb-6">
                 <Search size={40} className="text-steel-blue/50" />
              </div>
              <h3 className="text-2xl font-black mb-2">No bikes found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
