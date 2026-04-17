'use client';
import { useState, useEffect } from 'react';
import { SearchSelect, Option } from './SearchSelect';
import { LocationAsyncSelect } from './LocationAsyncSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    return (
        <section className="w-full relative  h-screen  flex items-center justify-center">
            <div className='absolute top-[10%] animate-spin duration-500 left-[-9%] w-70 h-70'>
                <img src="./assets/images/Tyer_round.png" className='w-full h-full' />
            </div>

            <div className="w-[80%] mx-auto">
                <div className=" absolute top-[-10rem] translate-x-1/2 right-1/2 w-[60%] mx-auto rounded-2xl bg-primary shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
                    <div className="px-10 py-8 text-white flex flex-col gap-6">

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        className="w-full p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>

                                {tripType === 'round-trip' ? (
                                    <div className="space-y-1 flex flex-col">
                                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Return Date</label>
                                        <DatePicker
                                            selected={returnDate}
                                            onChange={(date: Date | null) => setReturnDate(date)}
                                            minDate={pickupDate || new Date()}
                                            placeholderText="Select return date"
                                            className="w-full p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                ) : (
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
                                            className="w-full p-4 rounded-lg bg-[#ffffff0a] border border-[#ffffff1a] focus:bg-[#ffffff15] outline-none focus:border-dynamic-orange text-white transition-colors"
                                        />
                                    </div>
                                )}

                                {/* Car Type */}
                                <div className="space-y-1 md:col-span-2 mt-2">
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
                            <div className="mt-8">
                                <button className="w-full bg-dynamic-orange hover:bg-[#ff8559] text-white font-bold text-lg py-4 rounded-lg transition-transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(255,107,53,0.3)] uppercase tracking-wide">
                                    Book Ride Now
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='mt-[30rem] mx-auto w-full'>
                    <img src="./assets/images/taxi.png" className='w-full h-full' />
                </div>
            </div>

        </section>
    );
};