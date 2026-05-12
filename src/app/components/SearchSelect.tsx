'use client';
import { useState, useRef, useEffect } from 'react';

export type Option = { label: string; value: string };

interface SearchSelectProps {
    options: Option[];
    selected: Option | null;
    onChange: (option: Option) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    error?: boolean;
}

export const SearchSelect = ({
    options,
    selected,
    onChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyMessage = "No matches found.",
    error
}: SearchSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuPlacement, setMenuPlacement] = useState<'bottom' | 'top'>('bottom');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Close dropdown if clicked outside
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

            // Typical height of the opened dropdown menu is around 250px-300px
            const requiredHeight = 280;

            if (spaceBelow < requiredHeight && spaceAbove > spaceBelow) {
                setMenuPlacement('top');
            } else {
                setMenuPlacement('bottom');
            }
        }
    }, [isOpen]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {/* Main Select Button */}
            <div
                className={`w-full p-2 md:p-4 rounded-lg bg-[#ffffff0a] border ${error ? 'border-red-500' : 'border-[#ffffff1a]'} focus:bg-[#ffffff15] outline-none hover:border-dynamic-orange text-white cursor-pointer flex justify-between items-center transition-colors`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selected ? 'text-white truncate pr-2' : 'text-gray-500'}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>

            {/* Dropdown with Search */}
            {isOpen && (
                <div
                    className={`absolute z-20 w-full bg-[#2D3E50] border border-[#ffffff1a] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in ${menuPlacement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                >
                    <div className="p-2 border-b border-[#ffffff1a]">
                        <input
                            type="text"
                            className="w-full p-3 bg-[#ffffff0a] rounded-md text-white outline-none focus:border-dynamic-orange focus:bg-[#ffffff15] border border-transparent placeholder-gray-400 transition-colors"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-48 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className={`p-4 text-sm cursor-pointer hover:bg-dynamic-orange hover:text-white transition-colors ${selected?.value === option.value ? 'bg-[#ffffff1a] text-dynamic-orange' : 'text-gray-200'
                                        }`}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-sm text-gray-400 text-center">{emptyMessage}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
