import React, { useState, useMemo } from 'react';
import { Car } from '../types.ts';
import { SlidersHorizontal, Heart, Search, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FleetPageProps {
  carsList: Car[];
  favorites: number[];
  selectedLocation: string;
  pickupDate: string;
  returnDate: string;
  onCarSelect: (car: Car) => void;
  onToggleFavorite: (id: number) => void;
  // All confirmed reservations (just to check availability in real-time)
  reservations: { carId: number; pickupDate: string; returnDate: string; status: string }[];
}

export const FleetPage: React.FC<FleetPageProps> = ({
  carsList,
  favorites,
  selectedLocation,
  pickupDate,
  returnDate,
  onCarSelect,
  onToggleFavorite,
  reservations,
}) => {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Dynamic set of brands
  const brands = useMemo(() => {
    const b = new Set(carsList.map((c) => c.brand));
    return ['All', ...Array.from(b)];
  }, [carsList]);

  // Determine if a car is available for current dates
  const checkIsCarAvailable = (carId: number): boolean => {
    if (!pickupDate || !returnDate) return true; // Default available if no dates searched
    
    // Check overlap with any confirmed reservation
    const hasOverlap = reservations.some(
      (res) =>
        res.carId === carId &&
        res.status === 'confirmed' &&
        res.pickupDate < returnDate &&
        res.returnDate > pickupDate
    );
    return !hasOverlap;
  };

  // Filter cars list
  const filteredCars = useMemo(() => {
    return carsList
      .filter((car) => {
        const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
        const matchesPrice = car.dailyRate <= maxPrice;
        const matchesSearch =
          searchQuery === '' ||
          car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.model.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBrand && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.dailyRate - b.dailyRate;
        if (sortBy === 'price_desc') return b.dailyRate - a.dailyRate;
        if (sortBy === 'horsepower_desc') return b.horsepower - a.horsepower;
        if (sortBy === 'year_desc') return b.year - a.year;
        return a.id - b.id; // stable popular default
      });
  }, [carsList, selectedBrand, maxPrice, searchQuery, sortBy]);

  return (
    <div className="bg-black min-h-screen py-16 text-white" id="fleet-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-12 text-center md:text-left">
          <span className="font-mono text-xs text-red-500 uppercase tracking-[0.2em] block mb-2">VELOCITY GARAGE</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">The Supercar Fleet</h1>
          {pickupDate && returnDate && (
            <p className="text-emerald-400 font-sans text-xs mt-3 flex items-center justify-center md:justify-start gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              Showing available slots from {pickupDate} to {returnDate}
            </p>
          )}
        </div>

        {/* Filter Widget Hub */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-12 shadow-xl" id="filter-widget">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            
            {/* Search Input */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1.5ID">
                <Search className="w-3.5 h-3.5" />
                Search Model
              </label>
              <input
                type="text"
                placeholder="e.g. Ferrari, Aventador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-850 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 placeholder-gray-500"
                id="search-fleet-input"
              />
            </div>

            {/* Brand filtering */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Select Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-stone-850 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                id="brand-filter-select"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Cap limits slider */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Max Daily Rate
                </label>
                <span className="text-sm font-semibold text-red-500 font-mono">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-red-600 h-1.5 bg-neutral-850 rounded-lg cursor-pointer"
                id="price-range-slider"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-850 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                id="sort-fleet-select"
              >
                <option value="popular">Standard Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="horsepower_desc">Horsepower</option>
                <option value="year_desc">Newest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* Cars list grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="fleet-cars-grid">
            {filteredCars.map((car) => {
              const isFav = favorites.includes(car.id);
              const isAvailable = checkIsCarAvailable(car.id);

              return (
                <div 
                  key={car.id} 
                  className="group bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20 hover:scale-[1.01] flex flex-col shadow-lg relative cursor-pointer"
                  onClick={() => onCarSelect(car)}
                  id={`fleet-car-${car.id}`}
                >
                  
                  {/* Photo frame */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-950">
                    <img
                      src={car.photos[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Available / Booked badge */}
                    <div className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-widest font-bold uppercase rounded-md border backdrop-blur-md px-2.5 py-1">
                      {isAvailable ? (
                        <span className="text-emerald-400 bg-emerald-950/80 border-emerald-500/30">Available</span>
                      ) : (
                        <span className="text-red-400 bg-red-950/80 border-red-500/30">Booked Out</span>
                      )}
                    </div>

                    {/* Favorite toggler */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(car.id);
                      }}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2.5 border border-white/10 transition-all cursor-pointer z-25"
                      id={`fav-btn-fleet-${car.id}`}
                    >
                      <Heart className={`w-4 h-4 transition-transform duration-300 ${isFav ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-300 group-hover:scale-110'}`} />
                    </button>
                    {/* Year badge */}
                    <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-xs font-mono tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                      {car.year}
                    </span>
                  </div>

                  {/* Body text specifications */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-400 text-xs font-mono mt-1 uppercase tracking-wider">{car.engine}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center border-y border-white/5 py-3 text-xs font-mono text-gray-300">
                        <div>
                          <span className="block text-[10px] text-gray-500">HP</span>
                          <strong className="font-sans text-sm text-white font-bold">{car.horsepower}</strong>
                        </div>
                        <div className="border-x border-white/5">
                          <span className="block text-[10px] text-gray-500">Drivetrain</span>
                          <strong className="font-sans text-sm text-white font-bold">{car.drivetrain}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500">0–60 MPH</span>
                          <strong className="font-sans text-sm text-white font-bold">{car.zeroToSixty}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom rates & reservation */}
                    <div className="mt-6 flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Daily Rate</span>
                        <p className="text-xl font-bold font-sans text-white">
                          ${car.dailyRate.toLocaleString()} <span className="text-xs font-medium text-gray-400">/ day</span>
                        </p>
                      </div>
                      <button
                        onClick={() => onCarSelect(car)}
                        className="px-4.5 py-2.5 bg-neutral-800 group-hover:bg-red-600 group-hover:text-white rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center space-x-1"
                        id={`fleet-reserve-btn-${car.id}`}
                      >
                        <span>Reserve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900 border border-white/10 rounded-2xl" id="fleet-empty-state">
            <p className="text-gray-450 font-mono text-sm">No supercars found with selected options.</p>
            <button
              onClick={() => {
                setSelectedBrand('All');
                setMaxPrice(5000);
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
