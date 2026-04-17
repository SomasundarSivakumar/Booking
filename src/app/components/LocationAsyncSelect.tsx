'use client';
import { useState, useRef, useEffect } from 'react';

export type Option = { label: string; value: string };

interface LocationAsyncSelectProps {
    selected: Option | null;
    onChange: (option: Option) => void;
    placeholder?: string;
    searchPlaceholder?: string;
}

export const LocationAsyncSelect = ({ 
    selected, 
    onChange, 
    placeholder = "Select a location",
    searchPlaceholder = "Search cities, towns, villages..."
}: LocationAsyncSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuPlacement, setMenuPlacement] = useState<'bottom' | 'top'>('bottom');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        if (isOpen && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const requiredHeight = 280; 
            
            if (spaceBelow < requiredHeight && spaceAbove > spaceBelow) {
                setMenuPlacement('top');
            } else {
                setMenuPlacement('bottom');
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length < 3) {
                setOptions([]);
                return;
            }

            setIsLoading(true);
            try {
                // Nominatim OpenStreetMap API - free geocoding. 
                // countrycodes=in forces search inside India
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&countrycodes=in&limit=10`);
                if (res.ok) {
                    const data = await res.json();
                    
                    // Deduplicate and format options
                    const formattedOptions = data.map((item: any) => ({
                        label: item.display_name,
                        value: `${item.lat},${item.lon}` // using coordinates as unique value
                    }));
                    setOptions(formattedOptions);
                }
            } catch (error) {
                console.error("Error fetching locations", error);
            } finally {
                setIsLoading(false);
            }
        }, 800); // 800ms debounce to be polite to the free API limit

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, isOpen]);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                className="w-full p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none hover:border-dynamic-orange text-white cursor-pointer flex justify-between items-center transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selected ? 'text-white truncate pr-2' : 'text-gray-500'}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>

            {isOpen && (
                <div 
                    className={`absolute z-30 w-full bg-[#2D3E50] border border-[#ffffff1a] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in ${
                        menuPlacement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                >
                    <div className="p-2 border-b border-[#ffffff1a] relative">
                        <input
                            type="text"
                            className="w-full p-3 bg-[#ffffff0a] rounded-md text-white outline-none focus:border-dynamic-orange focus:bg-[#ffffff15] border border-transparent placeholder-gray-400 transition-colors pr-10"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        {/* Loading spinner */}
                        {isLoading && (
                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-dynamic-orange border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <ul className="max-h-56 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        {searchTerm.length < 3 ? (
                            <li className="p-4 text-sm text-gray-400 text-center">Type at least 3 characters to search...</li>
                        ) : options.length > 0 ? (
                            options.map((option) => (
                                <li
                                    key={option.value}
                                    title={option.label}
                                    className={`p-4 text-xs leading-relaxed cursor-pointer hover:bg-dynamic-orange hover:text-white transition-colors border-b border-[#ffffff0a] last:border-0 ${
                                        selected?.value === option.value ? 'bg-[#ffffff1a] text-dynamic-orange' : 'text-gray-200'
                                    }`}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    <div className="line-clamp-2">{option.label}</div>
                                </li>
                            ))
                        ) : !isLoading ? (
                            <li className="p-4 text-sm text-gray-400 text-center">No locations found.</li>
                        ) : null}
                    </ul>
                </div>
            )}
        </div>
    );
};
