import React, { useState, useEffect } from 'react';
import { Car, PickupLocation } from '../types.ts';
import { MapPin, Calendar, Check, CircleAlert, Sparkles, Sliders, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingDateRange {
  pickupDate: string;
  returnDate: string;
}

interface CarDetailPageProps {
  car: Car;
  locations: PickupLocation[];
  unavailableDates: BookingDateRange[];
  initialLocationId?: string;
  initialPickupDate?: string;
  initialReturnDate?: string;
  onBackToFleet: () => void;
  onInitiateBooking: (params: {
    carId: number;
    pickupLocationId: number;
    pickupDate: string;
    returnDate: string;
  }) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  car,
  locations,
  unavailableDates,
  initialLocationId = '',
  initialPickupDate = '',
  initialReturnDate = '',
  onBackToFleet,
  onInitiateBooking,
  onToggleFavorite,
  favorites,
}) => {
  const [activePhoto, setActivePhoto] = useState(car.photos[0]);
  const [pickupLocationId, setPickupLocationId] = useState(initialLocationId);
  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [validationError, setValidationError] = useState('');

  // Sync active photo whenever the car changes
  useEffect(() => {
    setActivePhoto(car.photos[0]);
    setPickupLocationId(initialLocationId);
    setPickupDate(initialPickupDate);
    setReturnDate(initialReturnDate);
    setValidationError('');
  }, [car, initialLocationId, initialPickupDate, initialReturnDate]);

  const isFav = favorites.includes(car.id);

  // Parse list of individual blocked date strings to highlight in the calendar
  const blockedDatesSet = React.useMemo(() => {
    const dates = new Set<string>();
    unavailableDates.forEach(({ pickupDate: p, returnDate: r }) => {
      let current = new Date(p);
      const end = new Date(r);
      
      // Since back-to-back are fine (pickup of second can equal return of first),
      // we exclude the return date itself from being completely blocked for the next pickup.
      // So block dates: p <= d < r
      while (current < end) {
        dates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }, [unavailableDates]);

  // Helper: check if a specific date is unavailable
  const isDateUnavailable = (dateStr: string): boolean => {
    return blockedDatesSet.has(dateStr);
  };

  // Check if current date selection overlaps with blocked dates
  const checkOverlap = (pickup: string, returnD: string): boolean => {
    if (!pickup || !returnD) return false;
    let curr = new Date(pickup);
    const last = new Date(returnD);
    while (curr < last) {
      const formatted = curr.toISOString().split('T')[0];
      if (isDateUnavailable(formatted)) {
        return true;
      }
      curr.setDate(curr.getDate() + 1);
    }
    return false;
  };

  const handleReserve = () => {
    if (!pickupLocationId) {
      setValidationError("Please select a pickup location.");
      return;
    }
    if (!pickupDate || !returnDate) {
      setValidationError("Please specify both pickup and return dates.");
      return;
    }
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    if (rDate <= pDate) {
      setValidationError("Return date must be after pickup date.");
      return;
    }

    // Overlap validation check
    const hasOverlap = checkOverlap(pickupDate, returnDate);
    if (hasOverlap) {
      setValidationError("This car is already booked for the selected dates. Please choose different dates.");
      return;
    }

    setValidationError('');
    onInitiateBooking({
      carId: car.id,
      pickupLocationId: parseInt(pickupLocationId),
      pickupDate,
      returnDate,
    });
  };

  // Simple visual calendar rendering for June 2026 (current user local time is June 2026)
  // Let's generate days for June 2026.
  const june2026Days = React.useMemo(() => {
    // June 2026 starts on a Monday (1)
    const totalDays = 30;
    const daysArr: { day: number; dateStr: string; label: string }[] = [];
    for (let i = 1; i <= totalDays; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      daysArr.push({
        day: i,
        dateStr: `2026-06-${dayStr}`,
        label: `${i}`,
      });
    }
    return daysArr;
  }, []);

  return (
    <div className="bg-black min-h-screen py-10 text-white" id="car-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Button */}
        <button
          onClick={onBackToFleet}
          className="flex items-center space-x-2 text-gray-450 hover:text-red-500 transition-colors mb-8 cursor-pointer text-sm font-semibold font-mono"
          id="back-to-fleet-btn"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK TO THE FLEET</span>
        </button>

        {/* Dynamic Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" id="car-detail-overview">
          
          {/* Column A: Gallery & Description */}
          <div className="space-y-6">
            
            {/* Gallery Main Active Frame */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl relative">
              <img
                src={activePhoto}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono font-bold text-red-500 tracking-wider">
                ACTIVE SHOT
              </span>
            </div>

            {/* Gallery Thumbnails List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {car.photos.map((ph, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(ph)}
                  className={`aspect-video rounded-lg overflow-hidden border cursor-pointer bg-neutral-950 transition-all ${
                    activePhoto === ph ? 'border-red-600 scale-[0.98]' : 'border-white/10 hover:border-white/30'
                  }`}
                  id={`gallery-thumb-${idx}`}
                >
                  <img src={ph} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            {/* Description Card */}
            <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Design & Performance Blueprint
              </h3>
              <p className="text-gray-350 text-sm leading-relaxed font-sans">
                {car.description}
              </p>
            </div>

            {/* Spec Sheet Grid */}
            <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-red-500" />
                Mechanical Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm font-sans">
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">Engine Kraft</span>
                  <strong className="text-white text-base font-bold">{car.engine}</strong>
                </div>
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">Horsepower</span>
                  <strong className="text-white text-base font-bold">{car.horsepower} hp</strong>
                </div>
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">0 to 60 MPH</span>
                  <strong className="text-white text-base font-bold">{car.zeroToSixty}</strong>
                </div>
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">Top Speed</span>
                  <strong className="text-white text-base font-bold">{car.topSpeed}</strong>
                </div>
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">Transmission</span>
                  <strong className="text-white text-base font-bold">{car.transmission}</strong>
                </div>
                <div className="border-l border-red-500 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest block">Drivetrain</span>
                  <strong className="text-white text-base font-bold">{car.drivetrain}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Column B: Interactive Reservation Dashboard & Booked Calendar */}
          <div className="space-y-8 sticky top-24">
            
            {/* Rates & Reservation controller card */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    {car.brand} {car.model}
                  </h2>
                  <p className="text-gray-450 font-mono text-xs">{car.year} Master Build Spec</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">DAILY FEE</span>
                  <p className="text-2xl font-black text-red-500">${car.dailyRate.toLocaleString()}</p>
                </div>
              </div>

              {/* User inputs form */}
              <div className="py-6 space-y-4">
                
                {/* Pick Location */}
                <div className="flex flex-col">
                  <label className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Delivery Hotspot
                  </label>
                  <select
                    value={pickupLocationId}
                    onChange={(e) => {
                      setPickupLocationId(e.target.value);
                      setValidationError('');
                    }}
                    className="bg-neutral-950 ring-1 ring-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-red-500 cursor-pointer"
                    id="details-location-select"
                  >
                    <option value="">Select pickup spot...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} ({loc.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates pickers split */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setPickupDate(e.target.value);
                        setValidationError('');
                      }}
                      className="bg-neutral-950 ring-1 ring-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-red-500 cursor-pointer"
                      id="details-pickup-date"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setReturnDate(e.target.value);
                        setValidationError('');
                      }}
                      className="bg-neutral-950 ring-1 ring-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-red-500 cursor-pointer"
                      id="details-return-date"
                    />
                  </div>
                </div>

              </div>

              {/* Error block */}
              {validationError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-rose-300 text-xs flex items-start gap-2.5" id="details-warning-block">
                  <CircleAlert className="w-5 h-5 shrink-0 text-red-500" />
                  <span className="leading-snug">{validationError}</span>
                </div>
              )}

              {/* Reserve action Button */}
              <button
                onClick={handleReserve}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl tracking-widest text-sm transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/20 uppercase cursor-pointer"
                id="details-reserve-btn"
              >
                Initiate Reservation
              </button>
            </div>

            {/* Real-time unavailable dates display (Stunning Custom Calendar Widget) */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6" id="unavailable-calendar-widget">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h4 className="font-bold text-white tracking-tight">Unavailable Slots</h4>
                  <p className="text-xs text-gray-400 mt-1">Direct availability tracker for June 2026</p>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-950 border border-red-500/50"></span>
                    Booked Out
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-white/5"></span>
                    Available
                  </span>
                </div>
              </div>

              {/* Grid 7 Header Days (Mon to Sun) */}
              <div className="grid grid-cols-7 gap-2 text-center text-gray-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* June 2026 dates list */}
              <div className="grid grid-cols-7 gap-2">
                {june2026Days.map((dayItem) => {
                  const isBlocked = isDateUnavailable(dayItem.dateStr);
                  const isSelected = pickupDate === dayItem.dateStr || returnDate === dayItem.dateStr;
                  let dayBg = "bg-stone-950 hover:bg-neutral-850 text-white border border-white/5";
                  let blockLine = false;

                  if (isBlocked) {
                    dayBg = "bg-red-950/40 border border-red-500/20 text-rose-300";
                    blockLine = true;
                  } else if (isSelected) {
                    dayBg = "bg-red-600 border border-red-500 text-white font-bold shadow-lg";
                  }

                  return (
                    <div
                      key={dayItem.day}
                      className={`h-11 rounded-lg flex flex-col items-center justify-center text-xs relative select-none cursor-default ${dayBg}`}
                      title={isBlocked ? "Dates currently reserved by another driver" : "Available Slot"}
                    >
                      <span className={blockLine ? "line-through text-red-500/70 font-semibold" : ""}>{dayItem.day}</span>
                      {isBlocked && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500"></span>}
                    </div>
                  );
                })}
              </div>

              {/* Dynamic feedback on booking overlap status */}
              {pickupDate && returnDate && !validationError && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-center gap-1.5" id="availability-cleared-block">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Prerequisite check passed! Safe to reserve.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
