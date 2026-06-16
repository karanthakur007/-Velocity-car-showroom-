import React, { useState } from 'react';
import { Car, PickupLocation, Destination } from '../types.ts';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Heart, 
  Award, 
  ShieldCheck, 
  Timer, 
  Flame, 
  Zap, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  locations: PickupLocation[];
  destinations: Destination[];
  featuredCars: Car[];
  favorites: number[];
  onCarSelect: (car: Car) => void;
  onSearchSubmit: (params: { locationId: string; pickupDate: string; returnDate: string }) => void;
  onToggleFavorite: (id: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  locations,
  destinations,
  featuredCars,
  favorites,
  onCarSelect,
  onSearchSubmit,
  onToggleFavorite,
}) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errorSearch, setErrorSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation) {
      setErrorSearch("Please select a pickup location.");
      return;
    }
    if (!pickupDate || !returnDate) {
      setErrorSearch("Please select pickup and return dates.");
      return;
    }
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    if (rDate <= pDate) {
      setErrorSearch("Return date must be after pickup date.");
      return;
    }
    setErrorSearch('');
    onSearchSubmit({
      locationId: searchLocation,
      pickupDate,
      returnDate,
    });
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans" id="landing-page-root">
      
      {/* Primary Dashboard Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: HERO SLIDER & FLEET EXHIBITION (span 8) */}
          <div className="lg:col-span-8 space-y-8 flex flex-col text-left">
            
            {/* 1. Feature Hero Banner Slider */}
            <div 
              className="relative h-[420px] rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8 md:p-12 shadow-2xl group"
              id="dashboard-hero-banner"
            >
              {/* Backing Slide Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1500&auto=format&fit=crop"
                alt="Ferrari SF90 Stradale Hero"
                className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:scale-[1.01] transition-transform duration-[6s]"
                referrerPolicy="no-referrer"
              />

              {/* Float specs indicator */}
              <div className="absolute top-6 right-6 z-20 font-mono text-[10px] text-gray-400 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/10 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-ping"></span>
                <span className="text-white font-bold">Featured: Ferrari SF90</span>
              </div>

              {/* Title & Tagline content */}
              <div className="relative z-20 max-w-xl">
                <span className="font-mono text-gold-550 text-[10px] tracking-[0.3em] uppercase mb-3 block font-bold">
                  VELOCITY EXOTIC DRIVES
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-white leading-[1.15]">
                  Extraordinary Cars.<br />Unforgettable Drives.
                </h1>
                <p className="text-gray-300 text-xs md:text-sm mb-6 font-sans tracking-wide leading-relaxed">
                  Experience the pinnacle of automotive engineering purity. Access our privately prepared supercar catalog across 19 world showroom centers instantly.
                </p>
                <button
                  onClick={() => onSearchSubmit({ locationId: '', pickupDate: '', returnDate: '' })}
                  className="px-6 py-3 bg-gradient-to-r from-gold-550 to-gold-600 text-black font-sans font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-gold-550/10 hover:opacity-90 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Our Collection</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Horizontal Feature Highlights Bar */}
            <div 
              className="bg-neutral-950/80 border border-white/5 rounded-2xl py-4.5 px-6 grid grid-cols-2 md:grid-cols-4 gap-4"
              id="feature-bullets-bar"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-gold-550" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-[11px] font-bold">Exclusively Supercars</span>
                  <span className="text-[9px] text-gray-400">Hand-selected models</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-gold-550" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-[11px] font-bold">Impeccable Service</span>
                  <span className="text-[9px] text-gray-400">Concierge delivery</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-gold-550" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-[11px] font-bold">Flexible Rentals</span>
                  <span className="text-[9px] text-gray-400">By-the-day tracking</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold-550" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-[11px] font-bold">Worldwide Access</span>
                  <span className="text-[9px] text-gray-400">19 delivery hubs</span>
                </div>
              </div>
            </div>

            {/* 3. Slider/Grid of Supercar Collection */}
            <div className="space-y-6 flex flex-col text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#d4a331] uppercase font-bold block mb-1">CURATED RACES</span>
                  <h2 className="text-xl md:text-2xl font-sans font-extrabold tracking-tight text-white">
                    Our Supercar Collection
                  </h2>
                </div>
                <button
                  onClick={() => onSearchSubmit({ locationId: '', pickupDate: '', returnDate: '' })}
                  className="flex items-center text-xs text-gray-400 hover:text-gold-550 transition-colors cursor-pointer font-bold space-x-1"
                >
                  <span>View All Fleet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal scroll cards */}
              <div 
                className="flex items-stretch overflow-x-auto pb-4 gap-6 scrollbar-thin"
                id="supercars-horizontal-scroller"
              >
                {featuredCars.map((car) => {
                  const isFav = favorites.includes(car.id);
                  return (
                    <div
                      key={car.id}
                      className="group bg-neutral-950 border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-w-[280px] md:min-w-[325px] hover:border-white/10 transition-all duration-300 relative shrink-0"
                    >
                      {/* Favorite indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(car.id);
                        }}
                        className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/10 transition-colors z-20 cursor-pointer text-gray-400 hover:text-red-500"
                        id={`fav-landing-${car.id}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
                      </button>

                      {/* Photo aspect box */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                        <img 
                          src={car.photos[0]} 
                          alt={car.model} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[9px] font-mono tracking-widest font-extrabold text-white px-2 py-0.5 rounded border border-white/10">
                          {car.year}
                        </span>
                      </div>

                      {/* Header details */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-bold text-white group-hover:text-gold-550 transition-colors">
                            {car.brand} {car.model}
                          </h4>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide mb-3">
                          {car.engine} • {car.horsepower} HP
                        </p>

                        {/* Direct specification beads */}
                        <div className="grid grid-cols-3 gap-1 bg-black/40 border border-white/5 p-2 rounded-lg text-center font-mono text-[9px] text-gray-400">
                          <div>
                            <span className="block text-[8px] text-gray-600">0–60 MPH</span>
                            <span className="text-white font-bold">{car.zeroToSixty}</span>
                          </div>
                          <div className="border-x border-white/5">
                            <span className="block text-[8px] text-gray-600">TOP LIMIT</span>
                            <span className="text-white font-bold">{car.topSpeed}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-gray-600">DRIVE</span>
                            <span className="text-white font-extrabold">{car.drivetrain}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rental pricing & reserve */}
                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">DAILY ACCESS</span>
                          <p className="text-sm font-bold text-white">
                            ${car.dailyRate.toLocaleString()} <span className="text-[10px] font-medium text-gray-400">/ day</span>
                          </p>
                        </div>

                        <button
                          onClick={() => onCarSelect(car)}
                          className="px-3.5 py-2 bg-neutral-900 group-hover:bg-gold-550 group-hover:text-black hover:opacity-90 rounded-lg text-[11px] font-extrabold tracking-wider transition-all duration-300 cursor-pointer flex items-center space-x-1"
                        >
                          <span>Reserve</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: INTERACTIVE WIDGET BOOKING & WHY VELOCITY (span 4) */}
          <div className="lg:col-span-4 space-y-6 sticky top-8 flex flex-col text-left">
            
            {/* 1. "Book Your Supercar" Form Widget */}
            <div 
              className="bg-neutral-950 border border-white/5 rounded-3xl p-6.5 shadow-2xl relative overflow-hidden"
              id="booking-form-widget"
            >
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-550/30 to-transparent"></div>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold-550" />
                  Book Your Supercar
                </h3>
                <span className="text-[9px] font-mono tracking-widest text-emerald-500 font-extrabold">SHOWROOM DIRECT</span>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                
                {/* Location Selection */}
                <div className="flex flex-col">
                  <label className="text-[9px] font-mono text-gray-450 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-550" />
                    Pick-up Location
                  </label>
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-gold-550 cursor-pointer"
                    id="widget-location-select"
                  >
                    <option value="">Select global center...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} ({loc.country})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date Selection */}
                <div className="flex flex-col">
                  <label className="text-[9px] font-mono text-gray-450 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-550" />
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-gold-550 cursor-pointer"
                    id="widget-pickup-date"
                  />
                </div>

                {/* Drop-off Date Selection */}
                <div className="flex flex-col">
                  <label className="text-[9px] font-mono text-gray-450 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-550" />
                    Drop-off Date
                  </label>
                  <input
                    type="date"
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-gold-550 cursor-pointer"
                    id="widget-return-date"
                  />
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold-550 to-gold-600 text-black font-sans font-black text-xs tracking-widest rounded-xl hover:opacity-90 shadow-lg shadow-gold-550/10 transition-all uppercase cursor-pointer flex items-center justify-center space-x-2"
                  id="widget-search-btn"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Supercars</span>
                </button>
              </form>

              {errorSearch && (
                <p className="text-red-500 font-mono text-[10px] mt-2 text-center" id="widget-form-error">{errorSearch}</p>
              )}
            </div>

            {/* 2. "Why Choose Velocity" Bullet checklist */}
            <div 
              className="bg-neutral-950 border border-white/5 rounded-3xl p-5.5 space-y-4"
              id="why-choose-widget"
            >
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                Why Choose Velocity?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-xs">
                  <CheckCircle2 className="w-4 h-4 text-gold-550 mr-2.5 shrink-0" />
                  <div className="flex flex-col">
                    <strong className="text-white font-bold">Handpicked Supercars</strong>
                    <span className="text-gray-500 text-[10px]">Exclusively fine vehicles</span>
                  </div>
                </li>
                <li className="flex items-start text-xs">
                  <CheckCircle2 className="w-4 h-4 text-gold-550 mr-2.5 shrink-0" />
                  <div className="flex flex-col">
                    <strong className="text-white font-bold">Transparent Pricing</strong>
                    <span className="text-gray-500 text-[10px]">Zero hidden fees. Full breakdown.</span>
                  </div>
                </li>
                <li className="flex items-start text-xs">
                  <CheckCircle2 className="w-4 h-4 text-gold-550 mr-2.5 shrink-0" />
                  <div className="flex flex-col">
                    <strong className="text-white font-bold">Full Insurance Coverage</strong>
                    <span className="text-gray-500 text-[10px]">Included waiver protection</span>
                  </div>
                </li>
                <li className="flex items-start text-xs">
                  <CheckCircle2 className="w-4 h-4 text-gold-550 mr-2.5 shrink-0" />
                  <div className="flex flex-col">
                    <strong className="text-white font-bold">Concierge Support</strong>
                    <span className="text-gray-500 text-[10px]">24/7 dedicated dispatch</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. Popular Destinations Block */}
            <div 
              className="bg-neutral-950 border border-white/5 rounded-3xl p-5.5 space-y-4"
              id="popular-destinations-widget"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Popular Destinations
                </h4>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onSearchSubmit({ locationId: '', pickupDate: '', returnDate: '' }); }}
                  className="text-[11px] text-gold-550 hover:underline font-bold"
                >
                  View all
                </a>
              </div>

              {/* Destination stack cards */}
              <div className="grid grid-cols-2 gap-3" id="widget-destinations-stack">
                {destinations.slice(0, 4).map((dest) => (
                  <div 
                    key={dest.id}
                    className="relative h-20 rounded-xl overflow-hidden group border border-white/5 cursor-pointer"
                    onClick={() => onSearchSubmit({ locationId: '', pickupDate: '', returnDate: '' })}
                  >
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors z-10" />
                    <img
                      src={dest.photo}
                      alt={dest.city}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 z-20 text-left">
                      <span className="text-[7px] font-mono tracking-widest text-[#d4a331] uppercase block">{dest.country}</span>
                      <strong className="text-[11px] font-sans text-white font-bold block">{dest.city}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
