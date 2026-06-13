'use client';

import { useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Map, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactCanvasBg } from './ContactCanvasBg';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const ContactUs = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const badge = section.querySelector('.contact-badge');
        const chars = section.querySelectorAll('.contact-char');
        const subtextElements = section.querySelectorAll('.contact-subtext');
        const cards = section.querySelectorAll('.contact-card');
        const mapContainer = section.querySelector('.contact-map-container');

        // Set initial states
        gsap.set(badge, { opacity: 0, y: -15 });
        gsap.set(chars, { opacity: 0, y: 15 });
        gsap.set(subtextElements, { opacity: 0, y: 20 });
        gsap.set(cards, { opacity: 0, x: -40 });
        gsap.set(mapContainer, { opacity: 0, x: 40 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
            }
        });

        tl.to(badge, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
        })
        .to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.01,
            ease: 'power3.out',
        }, '-=0.2')
        .to(subtextElements, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
        }, '-=0.2')
        .to(cards, {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
        }, '-=0.35')
        .to(mapContainer, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
        }, '-=0.45');
    }, []);

    const contactDetails = [
        {
            icon: <Phone className="text-dynamic-orange shrink-0" size={20} />,
            title: 'Call Us Now',
            value: '+91 70920 22232',
            description: 'Feel free to call or WhatsApp us anytime for queries and urgent bookings.',
            link: 'tel:+917092022232',
            actionText: 'Call Now'
        },
        {
            icon: <Mail className="text-steel-blue shrink-0" size={20} />,
            title: 'Email Address',
            value: 'prkshtravels@gmail.com',
            description: 'Send us your custom travel outlines, corporate requests, or feedback.',
            link: 'mailto:prkshtravels@gmail.com',
            actionText: 'Email Us'
        },
        {
            icon: <MapPin className="text-dynamic-orange shrink-0" size={20} />,
            title: 'Office Location',
            value: 'Sayalgudi, Tamil Nadu, 623120',
            description: 'Our primary headquarters located in Sayalgudi. Drop by or connect via post.',
            link: 'https://maps.google.com/?q=Sayalgudi,Tamil+Nadu',
            actionText: 'Get Directions'
        }
    ];

    return (
        <section ref={sectionRef} id="contact" className="relative bg-white py-16 lg:py-28 overflow-hidden font-heading text-gray-900 border-t border-gray-100">
            {/* Custom light starfall background */}
            <ContactCanvasBg effect="starfall" />

            <div className="relative z-10 w-full max-w-[92%] md:max-w-[88%] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="contact-badge inline-flex items-center gap-2 text-[0.65rem] font-black tracking-[4px] uppercase px-5 py-2 rounded-full bg-dynamic-orange/10 border border-dynamic-orange/15 text-dynamic-orange mb-5">
                        <Map size={12} strokeWidth={2.5} />
                        Get In Touch
                    </div>
                    <div className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-gray-900 leading-tight mb-4">
                        {"Contact ".split('').map((char, index) => (
                            <span key={`c-${index}`} className="contact-char inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                        <span className="contact-char bg-gradient-to-r from-dynamic-orange to-amber-accent bg-clip-text text-transparent inline-block">
                            Us
                        </span>
                    </div>
                    <p className="contact-subtext text-gray-500 text-[1rem] leading-7 max-w-[520px] mx-auto">
                        Have queries or ready to book a trip? Get in touch with our team or find our office location on the map below.
                    </p>
                </div>

                {/* Grid layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Details Cards (5/12 width) */}
                    <div className="lg:col-span-5 flex flex-col gap-5 justify-center w-full">
                        {contactDetails.map((detail, idx) => (
                            <a 
                                href={detail.link}
                                target={detail.link.startsWith('http') ? '_blank' : undefined}
                                rel={detail.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                aria-label={`${detail.title}: ${detail.value}`}
                                title={`${detail.title}: ${detail.value}`}
                                key={idx}
                                className="contact-card group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 sm:p-5 rounded-2xl bg-white/40 hover:bg-white border border-gray-100 hover:border-dynamic-orange/20 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-full"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-dynamic-orange/10 group-hover:border-dynamic-orange/20 transition-all duration-300 shrink-0">
                                    {detail.icon}
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="text-gray-800 text-[10px] font-black tracking-widest uppercase mb-1">
                                        {detail.title}
                                    </div>
                                    <p className="text-gray-900 text-sm sm:text-base font-black break-words my-1 hover:text-dynamic-orange transition-colors">
                                        {detail.value}
                                    </p>
                                    <p className="text-gray-500 text-xs leading-5 mt-1 font-medium">
                                        {detail.description}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-dynamic-orange uppercase tracking-wider mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                        {detail.actionText}
                                        <ExternalLink size={10} strokeWidth={2.5} />
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
 
                    {/* Right Column: Google Map Container (7/12 width) */}
                    <div className="lg:col-span-7 contact-map-container h-[300px] sm:h-[400px] lg:h-auto rounded-3xl overflow-hidden border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative bg-gray-50 flex w-full">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14257.819517897527!2d78.43535723981519!3d9.167923388106571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01656ef8a2e089%3A0x6c6d3ffa12c016a5!2sSayalgudi%2C%20Tamil%20Nadu%20623120!5e1!3m2!1sen!2sin!4v1781284017836!5m2!1sen!2sin" 
                            className="w-full min-h-[300px] sm:min-h-[400px] lg:min-h-full rounded-3xl border-0 shadow-lg relative z-10" 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Prakash Travels office location on Google Maps"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};
