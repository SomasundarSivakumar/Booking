"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  MapPin, Wallet, Tag, CalendarDays, Fuel, Search, SlidersHorizontal,
  ChevronDown, User, Clock3, Heart, X, PlusCircle, ArrowLeft, Car,
  Gauge, ArrowUpDown, BadgeCheck, Sparkles, Phone,
} from "lucide-react";
import { LocationSearch } from "@/app/components/LocationSearch";
import VehicleDetailModal from "@/app/components/VehicleDetailModal";

// ─── Data ─────────────────────────────────────────────────────────────────────
const allCars = [
  { id: 1, name: "Honda City 2020", brand: "Honda", price: 750000, priceLabel: "₹7,50,000", year: 2020, km: "32,000 km", fuel: "Petrol", tag: "Best Deal", location: "Chennai", seller: "Ravi Kumar", posted: "2 days ago", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=700&q=80" },
  { id: 2, name: "Maruti Swift 2021", brand: "Maruti", price: 520000, priceLabel: "₹5,20,000", year: 2021, km: "18,000 km", fuel: "Petrol", tag: "Low Mileage", location: "Coimbatore", seller: "Priya S", posted: "5 days ago", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=700&q=80" },
  { id: 3, name: "Toyota Innova 2019", brand: "Toyota", price: 1380000, priceLabel: "₹13,80,000", year: 2019, km: "55,000 km", fuel: "Diesel", tag: "Family Pick", location: "Madurai", seller: "Anand M", posted: "1 week ago", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=700&q=80" },
  { id: 4, name: "Hyundai i20 2022", brand: "Hyundai", price: 690000, priceLabel: "₹6,90,000", year: 2022, km: "9,000 km", fuel: "Petrol", tag: "Like New", location: "Salem", seller: "Karthik R", posted: "3 days ago", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=80" },
  { id: 5, name: "Tata Nexon 2021", brand: "Tata", price: 940000, priceLabel: "₹9,40,000", year: 2021, km: "24,000 km", fuel: "Diesel", tag: "Popular", location: "Trichy", seller: "Meena V", posted: "1 day ago", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80" },
  { id: 6, name: "Ford EcoSport 2019", brand: "Ford", price: 780000, priceLabel: "₹7,80,000", year: 2019, km: "42,000 km", fuel: "Petrol", tag: "Verified", location: "Chennai", seller: "Suresh P", posted: "4 days ago", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80" },
  { id: 7, name: "Maruti Baleno 2022", brand: "Maruti", price: 620000, priceLabel: "₹6,20,000", year: 2022, km: "11,000 km", fuel: "Petrol", tag: "Like New", location: "Erode", seller: "Divya K", posted: "6 days ago", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=700&q=80" },
  { id: 8, name: "Honda Amaze 2020", brand: "Honda", price: 580000, priceLabel: "₹5,80,000", year: 2020, km: "28,000 km", fuel: "Petrol", tag: "Best Deal", location: "Madurai", seller: "Gokul N", posted: "2 days ago", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=700&q=80" },
  { id: 9, name: "Hyundai Creta 2022", brand: "Hyundai", price: 1150000, priceLabel: "₹11,50,000", year: 2022, km: "14,000 km", fuel: "Petrol", tag: "Top Pick", location: "Coimbatore", seller: "Lakshmi S", posted: "3 days ago", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=80" },
  { id: 10, name: "Tata Harrier 2020", brand: "Tata", price: 1250000, priceLabel: "₹12,50,000", year: 2020, km: "40,000 km", fuel: "Diesel", tag: "Verified", location: "Salem", seller: "Mohan K", posted: "1 week ago", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=700&q=80" },
  { id: 11, name: "Maruti Dzire 2021", brand: "Maruti", price: 620000, priceLabel: "₹6,20,000", year: 2021, km: "20,000 km", fuel: "Petrol", tag: "Popular", location: "Trichy", seller: "Nithya P", posted: "5 days ago", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=700&q=80" },
  { id: 12, name: "Toyota Fortuner 2021", brand: "Toyota", price: 3200000, priceLabel: "₹32,00,000", year: 2021, km: "35,000 km", fuel: "Diesel", tag: "Premium", location: "Chennai", seller: "Arun R", posted: "Today", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=700&q=80" },
];

const brands = [...new Set(allCars.map(c => c.brand))];
const locations = [...new Set(allCars.map(c => c.location))];
const years = [...new Set(allCars.map(c => c.year))].sort((a, b) => b - a);
const fuelTypes = [...new Set(allCars.map(c => c.fuel))];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹5 Lakh", min: 0, max: 500000 },
  { label: "₹5 – ₹10 Lakh", min: 500000, max: 1000000 },
  { label: "₹10 – ₹20 Lakh", min: 1000000, max: 2000000 },
  { label: "Above ₹20 Lakh", min: 2000000, max: Infinity },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Year: Newest First", value: "year_desc" },
  { label: "Year: Oldest First", value: "year_asc" },
];

const tagColors: Record<string, string> = {
  "Best Deal": "#FF6B35", "Low Mileage": "#22c55e", "Family Pick": "#4682B4",
  "Like New": "#22c55e", Popular: "#a855f7", Verified: "#FFB703", Premium: "#ef4444", "Top Pick": "#FF6B35",
};

// ─── Custom Sort Dropdown ─────────────────────────────────────────────────────
function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1e2f42] border border-white/10 rounded-xl text-slate-200 text-sm font-semibold cursor-pointer min-w-[200px] hover:border-white/20 transition-colors"
      >
        <ArrowUpDown size={15} className="text-dynamic-orange shrink-0" strokeWidth={1.75} />
        <span className="flex-1 text-left">{current?.label}</span>
        <ChevronDown size={14} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-primary border border-white/10 rounded-xl overflow-hidden z-50 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 border-none text-sm flex items-center gap-2 transition-colors cursor-pointer
                ${opt.value === value
                  ? "bg-dynamic-orange/10 text-dynamic-orange font-bold"
                  : "bg-transparent text-slate-200 font-normal hover:bg-white/5"}`}
            >
              {opt.value === value && <span className="text-dynamic-orange text-xs">●</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
  selectedBrands, setSelectedBrands,
  selectedLocations, setSelectedLocations,
  selectedYears, setSelectedYears,
  selectedFuels, setSelectedFuels,
  selectedPriceRange, setSelectedPriceRange,
  activeFilterCount, clearAll,
}: {
  selectedBrands: string[]; setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocations: string[]; setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedYears: number[]; setSelectedYears: React.Dispatch<React.SetStateAction<number[]>>;
  selectedFuels: string[]; setSelectedFuels: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPriceRange: number; setSelectedPriceRange: React.Dispatch<React.SetStateAction<number>>;
  activeFilterCount: number; clearAll: () => void;
}) {
  const toggleArr = <V,>(arr: V[], val: V, set: React.Dispatch<React.SetStateAction<V[]>>) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const Section = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="mb-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 py-2.5 bg-transparent border-none cursor-pointer text-slate-400 font-bold text-[0.72rem] tracking-widest uppercase"
        >
          <span className="text-dynamic-orange flex">{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          <ChevronDown size={14} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="pb-4">{children}</div>}
        <div className="h-px bg-white/[0.06] mb-1" />
      </div>
    );
  };

  const CheckRow = ({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${checked ? "bg-dynamic-orange/[0.07]" : "hover:bg-white/[0.04]"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <span className={`w-[18px] h-[18px] rounded-md shrink-0 flex items-center justify-center transition-all border-2 ${checked ? "bg-dynamic-orange border-dynamic-orange" : "bg-transparent border-white/20"}`}>
        {checked && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span className={`flex-1 text-sm ${checked ? "text-slate-200 font-semibold" : "text-slate-400 font-normal"}`}>{label}</span>
      <span className="text-[0.7rem] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
    </label>
  );

  const RadioRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${checked ? "bg-dynamic-orange/[0.07]" : "hover:bg-white/[0.04]"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="hidden" />
      <span className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center transition-all border-2 ${checked ? "border-dynamic-orange" : "border-white/20"}`}>
        {checked && <span className="w-2 h-2 rounded-full bg-dynamic-orange" />}
      </span>
      <span className={`text-sm ${checked ? "text-slate-200 font-semibold" : "text-slate-400 font-normal"}`}>{label}</span>
    </label>
  );

  return (
    <div className="bg-[#162030] rounded-2xl p-5 border border-white/[0.07]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-dynamic-orange" strokeWidth={1.75} />
          <span className="text-white font-extrabold text-base">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-dynamic-orange text-white text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
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
          <CheckRow key={loc} label={loc} count={allCars.filter(c => c.location === loc).length}
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
          <CheckRow key={brand} label={brand} count={allCars.filter(c => c.brand === brand).length}
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
                  ${active ? "border-dynamic-orange bg-dynamic-orange/10 text-dynamic-orange font-bold" : "border-white/10 bg-transparent text-slate-400 hover:border-white/25"}`}>
                {year}
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={<Fuel size={15} strokeWidth={1.75} />} label="Fuel Type">
        <div className="flex flex-wrap gap-2 pt-1">
          {fuelTypes.map(fuel => {
            const active = selectedFuels.includes(fuel);
            return (
              <button key={fuel} onClick={() => toggleArr(selectedFuels, fuel, setSelectedFuels)}
                className={`px-4 py-1.5 rounded-lg border text-sm cursor-pointer transition-all font-medium
                  ${active ? "border-dynamic-orange bg-dynamic-orange/10 text-dynamic-orange font-bold" : "border-white/10 bg-transparent text-slate-400 hover:border-white/25"}`}>
                {fuel}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ─── Active Filter Chip ───────────────────────────────────────────────────────
function Chip({ label, icon, onRemove }: { label: string; icon: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-dynamic-orange/10 border border-dynamic-orange/30 rounded-full text-[0.78rem] text-dynamic-orange font-semibold">
      {icon} {label}
      <button onClick={onRemove} className="bg-transparent border-none text-dynamic-orange cursor-pointer flex p-0 ml-0.5 hover:opacity-70 transition-opacity">
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

// ─── Car Card ─────────────────────────────────────────────────────────────────
function CarCard({ car, faved, onFav, onClick }: { car: typeof allCars[0]; faved: boolean; onFav: () => void; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const tagColor = tagColors[car.tag] ?? "#FF6B35";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-[#1e2f42] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border
        ${hovered ? "border-dynamic-orange/40 -translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]" : "border-white/[0.07]"}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img src={car.image} alt={car.name}
          className={`w-full h-[190px] object-cover block transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`} />
        <span className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold px-3 py-1 rounded-full backdrop-blur-sm border"
          style={{ background: `${tagColor}20`, color: tagColor, borderColor: `${tagColor}44` }}>
          {car.tag}
        </span>
        <button onClick={e => { e.stopPropagation(); onFav(); }}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer transition-all
            ${faved ? "bg-dynamic-orange/90" : "bg-black/55 backdrop-blur-sm hover:bg-black/70"}`}>
          <Heart size={15} strokeWidth={1.75} className="text-white" />
        </button>
        <div className="absolute inset-0 bg-dynamic-orange/0 hover:bg-dynamic-orange/5 transition-colors duration-200" />
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[0.68rem] text-slate-400 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
          <Clock3 size={11} strokeWidth={1.75} /> {car.posted}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-white text-[0.95rem] font-bold mb-1">{car.name}</h3>
        <p className="text-dynamic-orange text-xl font-extrabold mb-3">{car.priceLabel}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { icon: <CalendarDays size={11} strokeWidth={1.75} />, label: car.year },
            { icon: <Gauge size={11} strokeWidth={1.75} />, label: car.km },
            { icon: <Fuel size={11} strokeWidth={1.75} />, label: car.fuel },
          ].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[0.7rem] text-slate-400 bg-white/[0.05] px-2.5 py-0.5 rounded-full">
              {m.icon} {m.label}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2.5 mb-3 border-t border-white/[0.07]">
          <span className="flex items-center gap-1 text-[0.75rem] text-slate-400">
            <MapPin size={12} strokeWidth={1.75} /> {car.location}
          </span>
          <span className="flex items-center gap-1 text-[0.75rem] text-slate-400">
            <User size={12} strokeWidth={1.75} /> {car.seller}
          </span>
        </div>
        <button
          className="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg border-none text-white text-sm font-bold cursor-pointer bg-gradient-to-r from-dynamic-orange to-amber-accent hover:opacity-90 transition-opacity"
        >
          <Phone size={14} strokeWidth={2} /> Contact Seller
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CarsListingPage() {
  const router = useRouter();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favs, setFavs] = useState<number[]>([]);
  const [selectedCar, setSelectedCar] = useState<typeof allCars[0] | null>(null);

  const clearAll = () => { setSelectedBrands([]); setSelectedLocations([]); setSelectedYears([]); setSelectedFuels([]); setSelectedPriceRange(0); setQuery(""); };
  const activeFilterCount = selectedBrands.length + selectedLocations.length + selectedYears.length + selectedFuels.length + (selectedPriceRange > 0 ? 1 : 0);

  const filtered = useMemo(() => {
    let r = [...allCars];
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(c => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)); }
    if (selectedBrands.length) r = r.filter(c => selectedBrands.includes(c.brand));
    if (selectedLocations.length) r = r.filter(c => selectedLocations.includes(c.location));
    if (selectedYears.length) r = r.filter(c => selectedYears.includes(c.year));
    if (selectedFuels.length) r = r.filter(c => selectedFuels.includes(c.fuel));
    const range = priceRanges[selectedPriceRange];
    r = r.filter(c => c.price >= range.min && c.price < range.max);
    switch (sortBy) {
      case "price_asc": r.sort((a, b) => a.price - b.price); break;
      case "price_desc": r.sort((a, b) => b.price - a.price); break;
      case "year_desc": r.sort((a, b) => b.year - a.year); break;
      case "year_asc": r.sort((a, b) => a.year - b.year); break;
    }
    return r;
  }, [query, selectedBrands, selectedLocations, selectedYears, selectedFuels, selectedPriceRange, sortBy]);

  const sidebarProps = { selectedBrands, setSelectedBrands, selectedLocations, setSelectedLocations, selectedYears, setSelectedYears, selectedFuels, setSelectedFuels, selectedPriceRange, setSelectedPriceRange, activeFilterCount, clearAll };

  return (
    <div className="min-h-screen bg-[#1a2636] font-heading text-slate-200">

      {/* Search + Sort Bar */}
      <div className="flex items-center gap-3 px-7 py-3 bg-primary border-b border-white/[0.07]">
        {/* Navigation & Logo */}
        <div className="flex items-center gap-3 shrink-0 mr-2">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-2 bg-dynamic-orange/10 border border-dynamic-orange/20 rounded-xl">
            <Car size={18} className="text-dynamic-orange" />
            <span className="text-[0.75rem] font-black uppercase tracking-widest text-white whitespace-nowrap">Cars Listing</span>
          </div>
        </div>

        {/* Location Picker (Custom Component) */}
        <LocationSearch 
          value={selectedLocations[0] || ""}
          onChange={(loc) => setSelectedLocations(loc ? [loc] : [])}
          accentColor="dynamic-orange"
          placeholder="Search Location..."
        />

        <div className="flex-1 flex items-center gap-2.5 bg-white/[0.08] border border-white/20 rounded-xl px-4 py-2.5 focus-within:border-dynamic-orange/60 transition-colors group">
          <Search size={18} strokeWidth={2.5} className="text-slate-400 shrink-0 group-focus-within:text-dynamic-orange" />
          <input
            type="text"
            placeholder="Find Cars, Brands and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-slate-500 font-medium"
          />
        </div>

        <SortDropdown value={sortBy} onChange={setSortBy} />

        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-dynamic-orange to-amber-accent border-none rounded-xl text-white font-bold text-sm cursor-pointer hover:shadow-[0_8px_20px_rgba(255,107,53,0.3)] transition-all active:scale-[0.98] shrink-0">
          <PlusCircle size={17} strokeWidth={2.5} />
          Post Free Ad
        </button>

        {/* Mobile filters toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-[#1e2f42] border border-white/[0.07] rounded-xl text-slate-200 text-sm font-semibold cursor-pointer"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Active Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 px-7 py-2.5 bg-dynamic-orange/[0.04] border-b border-white/[0.07]">
          {selectedLocations.map(l => <Chip key={l} label={l} icon={<MapPin size={12} strokeWidth={1.75} />} onRemove={() => setSelectedLocations(p => p.filter(x => x !== l))} />)}
          {selectedBrands.map(b => <Chip key={b} label={b} icon={<Tag size={12} strokeWidth={1.75} />} onRemove={() => setSelectedBrands(p => p.filter(x => x !== b))} />)}
          {selectedYears.map(y => <Chip key={y} label={String(y)} icon={<CalendarDays size={12} strokeWidth={1.75} />} onRemove={() => setSelectedYears(p => p.filter(x => x !== y))} />)}
          {selectedFuels.map(f => <Chip key={f} label={f} icon={<Fuel size={12} strokeWidth={1.75} />} onRemove={() => setSelectedFuels(p => p.filter(x => x !== f))} />)}
          {selectedPriceRange > 0 && <Chip label={priceRanges[selectedPriceRange].label} icon={<Wallet size={12} strokeWidth={1.75} />} onRemove={() => setSelectedPriceRange(0)} />}
          <button onClick={clearAll} className="bg-transparent border-none text-slate-400 text-[0.78rem] cursor-pointer underline hover:text-slate-200 transition-colors">
            Clear all
          </button>
        </div>
      )}

      {/* Layout */}
      <div className="flex max-w-[1440px] mx-auto px-7 py-6 gap-7">

        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-[270px] shrink-0">
          <FilterSidebar {...sidebarProps} />
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/70 z-[300] flex backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className="ml-auto w-[300px] max-w-[85vw] bg-[#162030] overflow-y-auto p-5 animate-[slideInRight_0.25s_ease]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-white">Filters</span>
                <button onClick={() => setMobileOpen(false)} className="bg-white/[0.07] border-none text-slate-200 w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors">
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
              <FilterSidebar {...sidebarProps} />
              <button onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 mt-4 bg-gradient-to-r from-dynamic-orange to-amber-accent border-none rounded-xl text-white font-extrabold cursor-pointer text-base hover:opacity-90 transition-opacity">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="mb-4 text-slate-400 text-sm">
            <span className="text-white font-bold text-base">{filtered.length}</span> cars found
            {query && <> for <span className="text-dynamic-orange">"{query}"</span></>}
          </p>

          {/* Detail Modal */}
          <VehicleDetailModal
            vehicle={selectedCar}
            accentColor="dynamic-orange"
            onClose={() => setSelectedCar(null)}
            faved={selectedCar ? favs.includes(selectedCar.id) : false}
            onFav={() => selectedCar && setFavs(f => f.includes(selectedCar.id) ? f.filter(x => x !== selectedCar.id) : [...f, selectedCar.id])}
          />

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Search size={48} strokeWidth={1.25} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-slate-200 text-xl font-bold mb-2">No cars found</h3>
              <p className="text-sm mb-6">Try adjusting your filters or search</p>
              <button onClick={clearAll} className="px-7 py-2.5 bg-dynamic-orange border-none rounded-lg text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5">
              {filtered.map(car => (
                <CarCard key={car.id} car={car}
                  faved={favs.includes(car.id)}
                  onFav={() => setFavs(f => f.includes(car.id) ? f.filter(x => x !== car.id) : [...f, car.id])}
                  onClick={() => setSelectedCar(car)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
