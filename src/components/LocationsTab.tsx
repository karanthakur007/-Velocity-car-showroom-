import React, { useState } from 'react';
import { PickupLocation } from '../types.ts';
import { MapPin, Search, Compass, ShieldCheck, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LocationsTabProps {
  locations: PickupLocation[];
  onSelectLocationForFleet: (locationId: string) => void;
}

export const LocationsTab: React.FC<LocationsTabProps> = ({ 
  locations, 
  onSelectLocationForFleet 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');

  const regions = [
    { label: 'All Global Centers', id: 'All' },
    { label: 'Europe', id: 'Monaco|France|Italy|United Kingdom|Germany|Spain|Switzerland' },
    { label: 'Americas', id: 'United States|Canada' },
    { label: 'Asia-Pacific', id: 'Japan|Singapore|Australia|China|India' },
    { label: 'Middle East', id: 'United Arab Emirates' },
    { label: 'Africa', id: 'South Africa' },
  ];

  // Helper to test if a location country matches region query
  const matchesRegion = (country: string, regionFilter: string) => {
    if (regionFilter === 'All') return true;
    const list = regionFilter.split('|');
    return list.some(item => country.toLowerCase().includes(item.toLowerCase()));
  };

  const filteredLocations = locations.filter(loc => {
    const query = searchTerm.toLowerCase();
    const matchSearch = 
      loc.city.toLowerCase().includes(query) || 
      loc.country.toLowerCase().includes(query) || 
      loc.name.toLowerCase().includes(query);
    
    const matchReg = matchesRegion(loc.country, activeRegion);
    return matchSearch && matchReg;
  });

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white" id="locations-tab-root">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center md:text-left mb-10">
          <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-3 block uppercase">
            WORLDWIDE SHIELDS
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
            Our Global Showrooms
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl leading-relaxed">
            From the Riviera of Monaco to the high-rises of Singapore, our fleet remains stationed near elite runways, yachts, and luxury suites. Explore high-speed access hubs.
          </p>
        </div>

        {/* Filters and Search Container */}
        <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2" id="region-buttons">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setActiveRegion(reg.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeRegion === reg.id
                    ? 'bg-gold-550 text-black font-extrabold shadow-md'
                    : 'bg-neutral-905 border border-white/5 text-gray-405 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by city, country, or center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-gold-550"
            />
          </div>
        </div>

        {/* Global Showrooms Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="locations-grid">
            {filteredLocations.map((loc, idx) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                className="group relative bg-neutral-950 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-gold-550/30 flex flex-col justify-between h-56"
              >
                {/* Decorative background grid effect */}
                <div className="absolute top-4 right-4 text-gold-550/10 group-hover:text-gold-550/20 transition-colors pointer-events-none">
                  <Compass className="w-20 h-20 rotate-[15deg]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#d4a331] uppercase bg-[#d4a331]/10 px-2.5 py-1 rounded-md border border-gold-550/10">
                      {loc.country}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Veloce Fleet Online"></span>
                  </div>

                  <h3 className="text-xl font-bold font-sans text-white group-hover:text-gold-550 transition-all">
                    {loc.city}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-550" />
                    {loc.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-3 italic line-clamp-2 pr-6">
                    {loc.address}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant Premium Gate</span>
                  </div>

                  <button
                    onClick={() => onSelectLocationForFleet(loc.id.toString())}
                    className="flex items-center space-x-1 py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-wider bg-gold-550/10 text-gold-550 hover:bg-gold-550 hover:text-black transition-all cursor-pointer"
                  >
                    <span>Dispatch Fleet</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-2xl max-w-md mx-auto">
            <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin-slow" />
            <h3 className="text-lg font-bold">No showroom found</h3>
            <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto">
              Our master concierge can arrange premium shipping anywhere in the world on special request. Connect immediately with our support desk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
