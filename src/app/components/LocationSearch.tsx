'use client';
import { useState, useRef, useEffect } from 'react';
import { MapPin, LocateFixed, Search, X, Check } from 'lucide-react';

interface LocationSearchProps {
    value: string;
    onChange: (location: string) => void;
    placeholder?: string;
    accentColor?: string; // e.g., 'steel-blue' or 'dynamic-orange'
}

const COMMON_CITIES = [
    "Chennai, Tamil Nadu",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "Pune, Maharashtra",
    "Kochi, Kerala",
    "Coimbatore, Tamil Nadu",
    "Madurai, Tamil Nadu",
    "Trichy, Tamil Nadu"
];

export const LocationSearch = ({ 
    value, 
    onChange, 
    placeholder = "Search location...",
    accentColor = "dynamic-orange"
}: LocationSearchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync local search term with value
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCities = COMMON_CITIES.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (city: string) => {
        onChange(city);
        setSearchTerm(city);
        setIsOpen(false);
    };

    const handleGeoLocation = () => {
        if (navigator.geolocation) {
            setSearchTerm("Detecting...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // In a real app, you'd use reverse geocoding here
                    handleSelect("Chennai, Tamil Nadu"); 
                },
                (err) => {
                    setSearchTerm(value);
                    alert("Location access denied.");
                }
            );
        }
    };

    const colorMap = {
        'steel-blue': {
            text: 'text-steel-blue',
            bg: 'bg-steel-blue',
            border: 'border-steel-blue',
            lightBg: 'bg-steel-blue/10',
            focusBorder: 'focus-within:border-steel-blue/60'
        },
        'dynamic-orange': {
            text: 'text-dynamic-orange',
            bg: 'bg-dynamic-orange',
            border: 'border-dynamic-orange',
            lightBg: 'bg-dynamic-orange/10',
            focusBorder: 'focus-within:border-dynamic-orange/60'
        }
    }[accentColor as 'steel-blue' | 'dynamic-orange'] || {
        text: 'text-dynamic-orange',
        bg: 'bg-dynamic-orange',
        border: 'border-dynamic-orange',
        lightBg: 'bg-dynamic-orange/10',
        focusBorder: 'focus-within:border-dynamic-orange/60'
    };

    return (
        <div className="relative w-full lg:w-[280px]" ref={wrapperRef}>
            <div 
                className={`flex items-center gap-2.5 bg-white/[0.08] border border-white/20 rounded-xl px-4 py-2.5 ${colorMap.focusBorder} transition-colors group cursor-text`}
                onClick={() => setIsOpen(true)}
            >
                <MapPin size={17} strokeWidth={2.5} className={`text-slate-400 shrink-0 group-focus-within:${colorMap.text}`} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-slate-500 font-medium"
                />
                {searchTerm && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm('');
                            onChange('');
                        }}
                        className="p-1 hover:bg-white/10 rounded-full text-slate-500 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full mt-2 w-full bg-[#1e2f42] border border-one/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {/* Current Location Option */}
                        <button 
                            onClick={handleGeoLocation}
                            className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors group`}
                        >
                            <div className={`p-2 ${colorMap.lightBg} rounded-lg ${colorMap.text} group-hover:${colorMap.bg} group-hover:text-white transition-all`}>
                                <LocateFixed size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Use Current Location</div>
                                <div className="text-[0.7rem] text-slate-400">Detect using GPS</div>
                            </div>
                        </button>

                        <div className="p-3 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">Popular Cities</div>

                        {filteredCities.map((city) => (
                            <button
                                key={city}
                                onClick={() => handleSelect(city)}
                                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition-colors group"
                            >
                                <span className={`text-sm ${value === city ? `${colorMap.text} font-bold` : 'text-slate-300'}`}>
                                    {city}
                                </span>
                                {value === city && <Check size={14} className={colorMap.text} />}
                            </button>
                        ))}

                        {filteredCities.length === 0 && (
                            <div className="p-8 text-center">
                                <Search size={24} className="mx-auto text-slate-600 mb-2" />
                                <div className="text-sm text-slate-500">No matching cities found</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
