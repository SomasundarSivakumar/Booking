'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FooterRainBg } from './FooterRainBg';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const Footer = () => {
    const footerRef = useRef<HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    useEffect(() => {
        const footer = footerRef.current;
        if (!footer) return;

        const footerCols = footer.querySelectorAll('.footer-col');
        const footerBottom = footer.querySelector('.footer-bottom');

        gsap.set(footerCols, { opacity: 0, y: 30 });
        gsap.set(footerBottom, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play reverse play reverse',
            }
        });

        tl.to(footerCols, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
        })
        .to(footerBottom, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, '-=0.25');
    }, []);

    return (
        <footer ref={footerRef} className="relative bg-[#070b14] pt-16 lg:pt-24 lg:pb-12 pb-8 px-5 border-t border-white/5 overflow-hidden font-heading text-slate-200">
            {/* ── 3D rain and thunder Canvas Background ── */}
            <FooterRainBg />

            <div className="relative z-10 max-w-[90%] mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-10 lg:mb-20">
                    <div className="footer-col col-span-1 md:col-span-2">
                        <div className="flex flex-col mb-6">
                            <span className="font-heading text-2xl font-extrabold tracking-tighter text-white leading-none">
                                PRAKASH <span className="text-amber-accent">TRAVELS</span>
                            </span>
                            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gray-400 font-bold mt-1">
                                Premium Mobility Solutions
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-7 mb-8 max-w-[400px]">
                            Your trusted partner for premium travel experiences in Tamil Nadu. Reliable, verified, and affordable cab services.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Prakash Travels on Facebook" title="Prakash Travels on Facebook" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-dynamic-orange hover:border-dynamic-orange transition-all group text-slate-400 hover:text-white">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/prakashcabs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Visit Prakash Travels on Instagram" title="Prakash Travels on Instagram" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-dynamic-orange hover:border-dynamic-orange transition-all group text-slate-400 hover:text-white">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Prakash Travels on X" title="Prakash Travels on X (Twitter)" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-dynamic-orange hover:border-dynamic-orange transition-all group text-slate-400 hover:text-white">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                                </svg>
                            </a>
                            <a href="https://wa.me/917092022232" target="_blank" rel="noopener noreferrer" aria-label="Chat with Prakash Travels on WhatsApp" title="Chat with Prakash Travels on WhatsApp" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-dynamic-orange hover:border-dynamic-orange transition-all group text-slate-400 hover:text-white">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-4 h-4">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <div className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Services</div>
                        <ul className="space-y-4 text-slate-500 text-sm font-medium animate-fade-in">
                            {['Car Rental', 'Taxi Service', 'Airport Transfer', 'Outstation Trips'].map(link => (
                                <li 
                                    key={link} 
                                    onClick={() => {
                                        setSelectedService(link);
                                        setIsModalOpen(true);
                                    }}
                                    className="hover:text-amber-accent transition-colors cursor-pointer"
                                >
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col">
                        <div className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Contact Us</div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Phone size={14} className="text-dynamic-orange mt-1 shrink-0" />
                                <a href="tel:+917092022232" title="Call Prakash Travels Customer Support" className="text-slate-500 text-sm hover:text-white transition-colors">+91 70920 22232</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail size={14} className="text-dynamic-orange mt-1 shrink-0" />
                                <a href="mailto:prkshtravels@gmail.com" title="Email Prakash Travels Support" className="text-slate-500 text-sm hover:text-white transition-colors">prkshtravels@gmail.com</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-dynamic-orange mt-1 shrink-0" />
                                <p className="text-slate-500 text-sm">Sayalkudi, Tamil Nadu</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
                    <p className="text-slate-600 text-xs font-medium">
                        &copy; {new Date().getFullYear()} Prakash Travels. All rights reserved.
                    </p>
                    <div className="lg:flex hidden gap-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
                        <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
                        <span className="hover:text-slate-400 cursor-pointer">Cookie Policy</span>
                    </div>
                </div>
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
        </footer>
    );
};
