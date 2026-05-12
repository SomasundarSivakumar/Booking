'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import { SearchSelect, Option } from './SearchSelect';
import { LocationAsyncSelect } from './LocationAsyncSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';

const CAR_OPTIONS = [
    { label: 'Swift Dzire (Sedan) - ₹11/km', value: 'swift_dzire', rate: 11 },
    { label: 'Ertiga (MPV) - ₹18/km', value: 'ertiga', rate: 18 },
    { label: 'Toyota Etios (Sedan) - ₹13/km', value: 'etios', rate: 13 },
    { label: 'Mahindra Scorpio (SUV) - ₹18/km', value: 'scorpio', rate: 18 },
    { label: 'Mahindra Bolero (SUV) - ₹16/km', value: 'bolero', rate: 16 },
    { label: 'Tata Zest (Sedan) - ₹12/km', value: 'zest', rate: 12 },
];

export const Booking = () => {
    const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
    const [selectedCar, setSelectedCar] = useState<Option | null>(null);
    const [pickupLocation, setPickupLocation] = useState<Option | null>(null);
    const [dropLocation, setDropLocation] = useState<Option | null>(null);
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [pickupTime, setPickupTime] = useState<Date | null>(null);
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (pickupLocation && dropLocation) {
            // value format: "lat,lon" from LocationAsyncSelect
            const [pickupLat, pickupLon] = pickupLocation.value.split(',');
            const [dropLat, dropLon] = dropLocation.value.split(',');

            const calculateDistance = async () => {
                setIsCalculatingDistance(true);
                try {
                    // OSRM coordinates format: lon,lat
                    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${dropLon},${dropLat}?overview=false`;
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.routes && data.routes.length > 0) {
                            // distance is originally in meters
                            const km = data.routes[0].distance / 1000;
                            setDistanceKm(Math.round(km));
                        }
                    }
                } catch (error) {
                    console.error("Error calculating distance:", error);
                } finally {
                    setIsCalculatingDistance(false);
                }
            };
            calculateDistance();
        } else {
            setDistanceKm(null);
        }
    }, [pickupLocation, dropLocation]);

    // Derived Rate state
    let totalRate: number | null = null;
    let computedDistance: number | null = null;
    if (distanceKm !== null) {
        computedDistance = tripType === 'round-trip' ? distanceKm * 2 : distanceKm;
        if (selectedCar) {
            const carDetails = CAR_OPTIONS.find(c => c.value === selectedCar.value);
            if (carDetails) {
                totalRate = computedDistance * carDetails.rate;
            }
        }
    }

    const [bookingTicket, setBookingTicket] = useState<any>(null);
    const autoDownloadTicketRef = useRef(false);

    const generateTicketPDF = useCallback(async (ticket: any, fileName: string) => {
        const element = document.getElementById('pdf-ticket-container');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#2D3E50'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ unit: 'mm', format: [105, 200] });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }, []);

    useEffect(() => {
        if (bookingTicket && autoDownloadTicketRef.current) {
            // Give DOM time to render the hidden container
            const timer = setTimeout(() => {
                const fileName = `booking-ticket-${bookingTicket.id?.split('-')[0]?.toUpperCase() || 'ticket'}.pdf`;
                generateTicketPDF(bookingTicket, fileName);
                autoDownloadTicketRef.current = false;
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [bookingTicket, generateTicketPDF]);

    const handleBooking = async () => {
        if (!pickupLocation || !dropLocation || !pickupDate || !selectedCar || !contact) {
            alert('Please fill out all required fields (Locations, Date, Car Model, Contact Number).');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                trip_type: tripType,
                car_model: selectedCar.label,
                pickup_location: pickupLocation.label,
                drop_location: dropLocation.label,
                contact: contact,
                pickup_date: pickupDate.toISOString().split('T')[0],
                return_date: returnDate ? returnDate.toISOString().split('T')[0] : null,
                pickup_time: pickupTime ? pickupTime.toLocaleTimeString() : null,
                distance_km: distanceKm,
                total_rate: totalRate,
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                autoDownloadTicketRef.current = true;
                setBookingTicket(data);

                // Clear form
                setContact('');
                setSelectedCar(null);
                setPickupLocation(null);
                setDropLocation(null);
                setDistanceKm(null);
                setPickupDate(null);
                setReturnDate(null);
                setPickupTime(null);
                setTripType('one-way');
            } else {
                const data = await res.json();
                alert('Error placing booking: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed to book', error);
            alert('An error occurred while placing the booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="booking" className="w-full relative md:h-screen md:flex md:items-center md:justify-center pb-8 md:pb-0">
            <div className='absolute top-[10%] animate-spin duration-500 left-[-9%] w-70 h-70 hidden md:block'>
                <img src="./assets/images/Tyer_round.png" className='w-full h-full' />
            </div>

            <div className="w-full pt-8 md:pt-0 lg:w-[80%] mx-auto">
                <div className="relative md:absolute top-0 md:top-[-10rem] md:translate-x-1/2 md:right-1/2 w-[95%] lg:w-[60%] mx-auto rounded-md lg:rounded-2xl bg-primary shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
                    <div className="px-5 lg:px-10 py-5 lg:py-8 text-white flex flex-col lg:gap-6 gap-2">

                        {/* Tabs */}
                        <div className="flex space-x-8 border-b border-white/20">
                            <button
                                onClick={() => setTripType('one-way')}
                                className={`pb-4 text-sm font-bold tracking-wider transition-all relative ${tripType === 'one-way' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                ONE WAY
                                {tripType === 'one-way' && (
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-dynamic-orange" />
                                )}
                            </button>
                            <button
                                onClick={() => setTripType('round-trip')}
                                className={`pb-4 text-sm font-bold tracking-wider transition-all relative ${tripType === 'round-trip' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                ROUND TRIP
                                {tripType === 'round-trip' && (
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-dynamic-orange" />
                                )}
                            </button>
                        </div>

                        {/* Form Area */}
                        <div className="mt-2 transition-all duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                {/* Pickup & Drop */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">From</label>
                                    <LocationAsyncSelect
                                        selected={pickupLocation}
                                        onChange={setPickupLocation}
                                        placeholder="Select pickup location"
                                        searchPlaceholder="Search cities, towns, villages..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">To</label>
                                    <LocationAsyncSelect
                                        selected={dropLocation}
                                        onChange={setDropLocation}
                                        placeholder="Select drop location"
                                        searchPlaceholder="Search cities, towns, villages..."
                                    />
                                </div>

                                {/* Date(s) */}
                                <div className="space-y-1 flex flex-col">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Pickup Date</label>
                                    <DatePicker
                                        selected={pickupDate}
                                        onChange={(date: Date | null) => setPickupDate(date)}
                                        minDate={new Date()}
                                        placeholderText="Select pickup date"
                                        className="w-full p-2 md:p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>

                                {tripType === 'round-trip' && (
                                    <div className="space-y-1 flex flex-col">
                                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Return Date</label>
                                        <DatePicker
                                            selected={returnDate}
                                            onChange={(date: Date | null) => setReturnDate(date)}
                                            minDate={pickupDate || new Date()}
                                            placeholderText="Select return date"
                                            className="w-full p-2 md:p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1 flex flex-col">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Pickup Time</label>
                                    <DatePicker
                                        selected={pickupTime}
                                        onChange={(date: Date | null) => setPickupTime(date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        placeholderText="Select time"
                                        className="w-full p-2 md:p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                    />
                                </div>

                                {/* Car Type & Contact */}
                                <div className="space-y-1 md:col-span-1 mt-0 md:mt-2">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Select Car Model</label>
                                    <SearchSelect
                                        options={CAR_OPTIONS}
                                        selected={selectedCar}
                                        onChange={setSelectedCar}
                                        placeholder="Search and choose your preferred car..."
                                        searchPlaceholder="Search cars..."
                                        emptyMessage="No cars matched your search."
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-1mt-o md:mt-2">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Contact Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={contact}
                                        onChange={e => setContact(e.target.value)}
                                        className="w-full p-2 md:p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors h-[50px] sm:h-[56px]"
                                    />
                                </div>
                            </div>

                            {/* Trip Summary (Distance & Rate) */}
                            {(distanceKm !== null || selectedCar) && (
                                <div className="mt-6 p-5 rounded-xl bg-[#0000003a] border border-[#ffffff1a] flex flex-col md:flex-row justify-between items-center animate-fade-in gap-4 text-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-dynamic-orange" />
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 font-semibold tracking-wider text-xs uppercase mb-1">Total Distance</span>
                                        {isCalculatingDistance ? (
                                            <span className="text-white font-medium">Calculating path...</span>
                                        ) : computedDistance !== null ? (
                                            <span className="text-white font-bold text-lg">
                                                {computedDistance} km <span className="text-gray-400 text-sm font-normal ml-1">{tripType === 'round-trip' ? '(Round Trip)' : '(One Way)'}</span>
                                            </span>
                                        ) : (
                                            <span className="text-white font-medium">-</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:text-right">
                                        <span className="text-gray-400 font-semibold tracking-wider text-xs uppercase mb-1">Estimated Rate</span>
                                        {totalRate !== null ? (
                                            <span className="text-dynamic-orange font-bold text-3xl">₹{totalRate.toLocaleString()}</span>
                                        ) : selectedCar ? (
                                            <span className="text-gray-400 font-medium">Select locations to calculate</span>
                                        ) : (
                                            <span className="text-gray-400 font-medium">Select a car</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Call to Action */}
                            <div className="md:mt-8 mt-4">
                                <button
                                    onClick={handleBooking}
                                    disabled={isSubmitting}
                                    className="w-full bg-dynamic-orange hover:bg-[#ff8559] text-white font-bold md:text-lg py-4 rounded-lg transition-transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(255,107,53,0.3)] uppercase tracking-wide disabled:opacity-50 disabled:hover:scale-100 cursor-pointer border-none"
                                >
                                    {isSubmitting ? 'Booking...' : 'Book Ride Now'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='mt-[35rem] hidden md:block   md:mt-[30rem] mx-auto  w-full'>
                    <img src="./assets/images/taxi.png" className='w-full h-full' />
                </div>
            </div>

            {/* Booking Ticket Modal — Shimmer Grid */}
            {bookingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="shimmer-border bg-white text-black p-5 rounded-2xl w-full max-w-lg relative shadow-2xl animate-scale-in">
                        <button
                            onClick={() => setBookingTicket(null)}
                            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black font-bold transition-colors cursor-pointer border-none z-10"
                        >
                            &times;
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">Booking Confirmed!</h2>
                                <p className="text-xs text-gray-500">Your ride has been successfully booked.</p>
                            </div>
                        </div>

                        {/* Details Grid with animations */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Booking ID</span>
                                    <span className="font-mono font-bold text-gray-900 text-xs">{bookingTicket.id?.split('-')[0]?.toUpperCase() || 'N/A'}</span>
                                </div>
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Trip Type</span>
                                    <span className="capitalize font-medium text-gray-900 text-xs">{bookingTicket.trip_type?.replace('-', ' ')}</span>
                                </div>
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Car Model</span>
                                    <span className="font-medium text-gray-900 text-xs">{bookingTicket.car_model}</span>
                                </div>
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Contact</span>
                                    <span className="font-medium text-gray-900 text-xs">{bookingTicket.contact}</span>
                                </div>
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Date & Time</span>
                                    <span className="font-medium text-gray-900 text-xs">{bookingTicket.pickup_date} {bookingTicket.pickup_time ? `| ${bookingTicket.pickup_time}` : ''}</span>
                                </div>
                                <div className="grid-item-animate bg-white rounded-lg p-2.5 border border-gray-100">
                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Est. Distance</span>
                                    <span className="font-medium text-gray-900 text-xs">{bookingTicket.distance_km} km</span>
                                </div>
                            </div>

                            {/* Route - full width */}
                            <div className="grid-item-animate mt-3 bg-white rounded-lg p-2.5 border border-gray-100">
                                <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Route</span>
                                <div className="flex items-center gap-2 text-xs text-gray-800">
                                    <span className="text-dynamic-orange text-[8px]">●</span>
                                    <span className="font-medium truncate">{bookingTicket.pickup_location}</span>
                                    <span className="text-gray-400 flex-shrink-0">→</span>
                                    <span className="text-dynamic-orange text-[8px]">●</span>
                                    <span className="font-medium truncate">{bookingTicket.drop_location}</span>
                                </div>
                            </div>

                            {/* Toll Allowance */}
                            <div className="grid-item-animate mt-3 bg-amber-50 rounded-lg p-2.5 border border-amber-200">
                                <span className="block text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-0.5">🛣️ Toll Allowance</span>
                                <span className="font-medium text-gray-800 text-xs">Toll charges as per actuals – to be paid by passenger directly at toll plazas.</span>
                            </div>

                            {/* Total Rate - highlighted */}
                            <div className="mt-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200 flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-sm">Total Rate</span>
                                <span className="font-black text-dynamic-orange text-2xl">₹{bookingTicket.total_rate?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mt-3 flex gap-3 text-[10px] text-gray-500">
                            <p className="flex items-start gap-1 flex-1"><span className="mt-px">⚠️</span><span>Extra km charges apply beyond estimated route.</span></p>
                            <p className="flex items-start gap-1 flex-1"><span className="mt-px">💬</span><span>Confirmation sent to your mobile.</span></p>
                            <p className="flex items-start gap-1 flex-1"><span className="mt-px">🚕</span><span>Driver details shared before trip.</span></p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => {
                                    const fileName = `booking-ticket-${bookingTicket.id?.split('-')[0]?.toUpperCase() || 'ticket'}.pdf`;
                                    generateTicketPDF(bookingTicket, fileName);
                                }}
                                className="flex-1 bg-primary hover:bg-[#3a5068] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer border-none uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download Ticket
                            </button>
                            <button
                                onClick={() => setBookingTicket(null)}
                                className="flex-1 bg-dynamic-orange hover:bg-[#ff8559] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer border-none uppercase tracking-wider text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden PDF Template Container */}
            {bookingTicket && (
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none', opacity: 0, zIndex: -1 }}>
                    <div id="pdf-ticket-container" className="w-[400px] bg-[#2D3E50] text-[#ffffff] p-0 relative" style={{ fontFamily: 'sans-serif' }}>
                        <div className="bg-[#FF6B35] p-4 text-center">
                            <h2 className="text-xl font-bold text-[#ffffff] mb-1">BOOKING CONFIRMED</h2>
                            <p className="text-xs text-[rgba(255,255,255,0.9)]">Your ride has been successfully booked</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="border-b border-[rgba(255,255,255,0.2)] border-dashed pb-4 mb-4" />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Booking ID</span>
                                    <span className="font-bold">{bookingTicket.id?.split('-')[0]?.toUpperCase() || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Trip Type</span>
                                    <span className="font-bold capitalize">{bookingTicket.trip_type?.replace('-', ' ')}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Car Model</span>
                                    <span className="font-bold">{bookingTicket.car_model}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Contact</span>
                                    <span className="font-bold">{bookingTicket.contact}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Date & Time</span>
                                    <span className="font-bold">{bookingTicket.pickup_date} {bookingTicket.pickup_time ? `| ${bookingTicket.pickup_time}` : ''}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Distance</span>
                                    <span className="font-bold">{bookingTicket.distance_km} km</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">From</span>
                                <span className="font-bold block leading-relaxed">{bookingTicket.pickup_location}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">To</span>
                                <span className="font-bold block leading-relaxed">{bookingTicket.drop_location}</span>
                            </div>

                            <div className="mt-4">
                                <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Toll Allowance</span>
                                <span className="font-bold">As per actuals (paid by passenger)</span>
                            </div>

                            <div className="mt-6 bg-[#FF6B35] rounded-lg p-4 flex justify-between items-center">
                                <span className="font-bold text-[#ffffff] text-sm">TOTAL RATE</span>
                                <span className="font-black text-[#ffffff] text-xl">₹{bookingTicket.total_rate?.toLocaleString() || '0'}</span>
                            </div>

                            <div className="mt-8 text-center space-y-1">
                                <p className="text-[9px] text-[#9ca3af]">Extra km charges apply. Toll charges as per actuals.</p>
                                <p className="text-[9px] text-[#9ca3af]">Driver details will be shared before trip.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};