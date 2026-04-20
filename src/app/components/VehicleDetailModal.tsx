'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, MapPin, User, Clock3,
  CalendarDays, Fuel, Gauge, Phone, Heart, BadgeCheck,
  Share2, Tag, Wallet, ArrowUpRight
} from 'lucide-react';

export interface VehicleData {
  id: number;
  name: string;
  brand: string;
  price: number;
  priceLabel: string;
  year: number;
  km: string;
  fuel: string;
  tag: string;
  location: string;
  seller: string;
  posted: string;
  image: string;
  // optional extra images — if not provided we derive variations
  images?: string[];
}

interface VehicleDetailModalProps {
  vehicle: VehicleData | null;
  accentColor: 'dynamic-orange' | 'steel-blue';
  onClose: () => void;
  faved: boolean;
  onFav: () => void;
}

const accent = {
  'dynamic-orange': {
    text: 'text-dynamic-orange',
    bg: 'bg-dynamic-orange',
    bgLight: 'bg-dynamic-orange/10',
    border: 'border-dynamic-orange/30',
    btn: 'from-dynamic-orange to-amber-500',
    dot: '#FF6B35',
  },
  'steel-blue': {
    text: 'text-steel-blue',
    bg: 'bg-steel-blue',
    bgLight: 'bg-steel-blue/10',
    border: 'border-steel-blue/30',
    btn: 'from-steel-blue to-blue-600',
    dot: '#4682B4',
  },
} as const;

export default function VehicleDetailModal({
  vehicle,
  accentColor,
  onClose,
  faved,
  onFav,
}: VehicleDetailModalProps) {
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const c = accent[accentColor];

  // Build image list (3 variants from the single Unsplash URL)
  const images: string[] = vehicle
    ? vehicle.images ?? [
        vehicle.image,
        vehicle.image.replace('w=700', 'w=700&crop=entropy'),
        vehicle.image.replace('w=700', 'w=800&crop=faces'),
      ]
    : [];

  // Animate in
  useEffect(() => {
    if (vehicle) {
      setActiveIdx(0);
      setIsClosing(false);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [vehicle]);

  // Lock body scroll
  useEffect(() => {
    if (vehicle) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [vehicle]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setVisible(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!vehicle) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') setActiveIdx(i => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setActiveIdx(i => (i < images.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [vehicle, handleClose, images.length]);

  if (!vehicle && !isClosing) return null;
  if (!vehicle) return null;

  const tagColorMap: Record<string, string> = {
    'Best Deal': '#FF6B35', 'Low Mileage': '#22c55e', 'Family Pick': '#4682B4',
    'Like New': '#22c55e', Popular: '#a855f7', Verified: '#FFB703', Premium: '#ef4444',
    'Top Pick': '#4682B4', Sports: '#a855f7', Racing: '#ef4444', 'Best Deal ': '#FF6B35',
  };
  const tagColor = tagColorMap[vehicle.tag] ?? c.dot;

  const specs = [
    { icon: <CalendarDays size={16} strokeWidth={1.75} />, label: 'Year', value: vehicle.year },
    { icon: <Gauge size={16} strokeWidth={1.75} />, label: 'Driven', value: vehicle.km },
    { icon: <Fuel size={16} strokeWidth={1.75} />, label: 'Fuel', value: vehicle.fuel },
    { icon: <Tag size={16} strokeWidth={1.75} />, label: 'Brand', value: vehicle.brand },
    { icon: <MapPin size={16} strokeWidth={1.75} />, label: 'Location', value: vehicle.location },
    { icon: <Clock3 size={16} strokeWidth={1.75} />, label: 'Listed', value: vehicle.posted },
  ];

  return (
    <div
      className={`fixed inset-0 z-[500] flex items-end sm:items-center justify-center transition-all duration-300 ease-out
        ${visible ? 'bg-black/75 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
      onClick={handleClose}
    >
      {/* Modal Panel */}
      <div
        onClick={e => e.stopPropagation()}
        className={`relative w-full sm:w-[680px] max-h-[95vh] bg-[#162030] rounded-t-3xl sm:rounded-3xl
          border border-white/[0.08] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)]
          transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-[0.96] sm:translate-y-0 sm:scale-[0.92]'
          }`}
        style={{ transitionDuration: '350ms' }}
      >
        {/* ── Image Carousel ──────────────────────────────────────────── */}
        <div className="relative h-[280px] sm:h-[320px] bg-[#0e1826] shrink-0 overflow-hidden">
          {/* Images */}
          <div className="relative w-full h-full">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${vehicle.name} photo ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out
                  ${idx === activeIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              />
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#162030]/90 via-transparent to-transparent" />

          {/* Tag Badge */}
          <span
            className="absolute top-4 left-4 text-[0.65rem] font-bold px-3 py-1 rounded-full backdrop-blur-md border"
            style={{ background: `${tagColor}22`, color: tagColor, borderColor: `${tagColor}55` }}
          >
            {vehicle.tag}
          </span>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Fav + Share */}
          <div className="absolute top-4 right-16 flex gap-2">
            <button
              onClick={onFav}
              className={`w-9 h-9 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer
                ${faved ? `${c.bg} border-transparent` : 'bg-black/60 hover:bg-black/80'}`}
            >
              <Heart size={15} strokeWidth={1.75} className="text-white" />
            </button>
            <button className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer">
              <Share2 size={15} strokeWidth={1.75} />
            </button>
          </div>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx(i => (i > 0 ? i - 1 : images.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setActiveIdx(i => (i < images.length - 1 ? i + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer border-none
                  ${idx === activeIdx ? 'w-5 h-1.5' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`}
                style={idx === activeIdx ? { background: c.dot } : {}}
              />
            ))}
          </div>

          {/* Photo count */}
          <span className="absolute bottom-4 right-4 text-[0.68rem] text-white/70 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
            {activeIdx + 1} / {images.length}
          </span>
        </div>

        {/* ── Scrollable Details ──────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black text-white leading-tight">{vehicle.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-slate-400 text-sm">{vehicle.brand}</span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1 text-sm text-slate-400">
                  <MapPin size={12} strokeWidth={1.75} /> {vehicle.location}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-2xl font-black ${c.text}`}>{vehicle.priceLabel}</p>
              <p className="text-slate-500 text-xs mt-0.5">Negotiable</p>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {specs.map((s, i) => (
              <div key={i} className={`${c.bgLight} border ${c.border} rounded-xl p-3 flex flex-col gap-1`}>
                <span className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider ${c.text}`}>
                  {s.icon} {s.label}
                </span>
                <span className="text-white font-semibold text-sm">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.07] mb-5" />

          {/* Seller Info */}
          <div className="flex items-center gap-4 p-4 bg-white/[0.04] rounded-2xl border border-white/[0.07] mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <User size={22} strokeWidth={1.75} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">{vehicle.seller}</span>
                <BadgeCheck size={15} className={c.text} />
              </div>
              <p className="text-slate-500 text-sm">Verified Seller</p>
            </div>
            <div className="flex items-center gap-1 text-[0.75rem] text-slate-500">
              <Clock3 size={12} strokeWidth={1.75} />
              <span>{vehicle.posted}</span>
            </div>
          </div>

          {/* Description placeholder */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-2 text-sm">About this vehicle</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Well maintained {vehicle.brand} in excellent condition. Single owner, all service records available.
              Recently serviced with new tyres. Genuine buyers only. Price slightly negotiable.
            </p>
          </div>
        </div>

        {/* ── CTA Footer ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-white/[0.07] bg-[#162030] flex gap-3 shrink-0">
          <button className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <ArrowUpRight size={17} strokeWidth={2} />
            View Full Details
          </button>
          <button
            className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${c.btn} text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg`}
          >
            <Phone size={17} strokeWidth={2} />
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}
