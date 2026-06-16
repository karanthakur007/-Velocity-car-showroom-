import React, { useState, useEffect, useMemo } from 'react';
import { PickupLocation } from '../types.ts';
import { 
  MapPin, 
  Search, 
  Compass, 
  ShieldCheck, 
  ChevronRight, 
  Globe, 
  AlertCircle, 
  Plus, 
  Minus, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import worldData from './world-110m.json';

interface LocationsTabProps {
  locations: PickupLocation[];
  onSelectLocationForFleet: (locationId: string) => void;
}

// Global coordinates for the 19 supercar showrooms (Longitude, Latitude)
const CITY_COORDINATES: Record<string, [number, number]> = {
  "Monte Carlo": [7.4246, 43.7384],
  "Dubai": [55.2708, 25.2048],
  "Los Angeles": [-118.2437, 34.0522],
  "Miami": [-80.1918, 25.7617],
  "New York City": [-74.0060, 40.7128],
  "London": [-0.1278, 51.5074],
  "Tokyo": [139.6917, 35.6895],
  "Paris": [2.3522, 48.8566],
  "Milan": [9.1859, 45.4654],
  "Singapore": [103.8519, 1.3521],
  "Geneva": [6.1432, 46.2044],
  "Sydney": [151.2093, -33.8688],
  "Cape Town": [18.4241, -33.9249],
  "Munich": [11.5820, 48.1351],
  "Mumbai": [72.8777, 19.0760],
  "Ibiza": [1.4302, 38.9067],
  "Lake Como": [9.2635, 45.9904],
  "Shanghai": [121.4737, 31.2304],
  "Toronto": [-79.3832, 43.6532]
};

// Region focus areas { center: [lon, lat], zoom }
const REGION_ZOOMS: Record<string, { coordinates: [number, number]; zoom: number }> = {
  "All": { coordinates: [15, 25], zoom: 1 },
  "Monaco|France|Italy|United Kingdom|Germany|Spain|Switzerland": { coordinates: [8, 48], zoom: 3.2 }, 
  "United States|Canada": { coordinates: [-95, 42], zoom: 1.8 }, 
  "Japan|Singapore|Australia|China|India": { coordinates: [115, 10], zoom: 1.6 }, 
  "United Arab Emirates": { coordinates: [55, 25], zoom: 3.5 }, 
  "South Africa": { coordinates: [24, -28], zoom: 2.8 }
};

export const LocationsTab: React.FC<LocationsTabProps> = ({ 
  locations, 
  onSelectLocationForFleet 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  
  // Interactive map states
  const [geoData] = useState<any>(worldData);
  const [mapLoading] = useState(false);
  const [mapError] = useState(false);
  
  const [mapPosition, setMapPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [15, 25],
    zoom: 1
  });
  
  const [selectedMapLocation, setSelectedMapLocation] = useState<PickupLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<PickupLocation | null>(null);

  const regions = [
    { label: 'All Global Centers', id: 'All' },
    { label: 'Europe', id: 'Monaco|France|Italy|United Kingdom|Germany|Spain|Switzerland' },
    { label: 'Americas', id: 'United States|Canada' },
    { label: 'Asia-Pacific', id: 'Japan|Singapore|Australia|China|India' },
    { label: 'Middle East', id: 'United Arab Emirates' },
    { label: 'Africa', id: 'South Africa' },
  ];

  // Helper to test if a location country matches region query
  const matchesRegion = (country: string | undefined, regionFilter: string) => {
    if (regionFilter === 'All') return true;
    if (!country) return false;
    const list = regionFilter.split('|');
    return list.some(item => country.toLowerCase().includes(item.toLowerCase()));
  };

  const matchesCountryGeo = (geoName: string | undefined, countryName: string | undefined) => {
    if (!geoName || !countryName) return false;
    const g = geoName.toLowerCase();
    const c = countryName.toLowerCase();
    if (g === c) return true;
    if (g === "united states of america" && c === "united states") return true;
    if (g === "united kingdom" && c === "united kingdom") return true;
    return false;
  };

  // Sync region button clicks with automated map centering & zooming
  const handleRegionClick = (regionId: string) => {
    setActiveRegion(regionId);
    setSearchTerm(''); // Clear previous searches when flipping regions
    const zoomConfig = REGION_ZOOMS[regionId];
    if (zoomConfig) {
      setMapPosition({
        coordinates: zoomConfig.coordinates,
        zoom: zoomConfig.zoom
      });
    }
  };

  // Click on map geography country -> auto filter grid below by country
  const handleGeographyClick = (geo: any) => {
    const countryName = geo?.properties?.name;
    if (!countryName) return;
    let matchedCountry = countryName;
    if (countryName === "United States of America") matchedCountry = "United States";

    // Verify if we have showrooms in this country
    const shows = locations.filter(l => l.country && l.country.toLowerCase() === matchedCountry.toLowerCase());
    if (shows.length > 0) {
      setSearchTerm(matchedCountry);
      // Auto-focus first showroom in that region
      setSelectedMapLocation(shows[0]);
      const coords = shows[0].city ? CITY_COORDINATES[shows[0].city] : null;
      if (coords) {
        setMapPosition({
          coordinates: coords,
          zoom: 3
        });
      }
    }
  };

  // Click specific map pin -> display detailed bottom console and narrow filter list
  const handleMarkerClick = (loc: PickupLocation) => {
    setSelectedMapLocation(loc);
    setSearchTerm(loc.city || '');
    const coords = loc.city ? CITY_COORDINATES[loc.city] : null;
    if (coords) {
      setMapPosition({
        coordinates: coords,
        zoom: 4
      });
    }
  };

  const handleZoomIn = () => {
    setMapPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 12) }));
  };

  const handleZoomOut = () => {
    setMapPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 1) }));
  };

  const handleResetMap = () => {
    setMapPosition({ coordinates: [15, 25], zoom: 1 });
    setSelectedMapLocation(null);
    setSearchTerm('');
    setActiveRegion('All');
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const query = (searchTerm || '').toLowerCase();
      const matchSearch = 
        (loc.city || '').toLowerCase().includes(query) || 
        (loc.country || '').toLowerCase().includes(query) || 
        (loc.name || '').toLowerCase().includes(query);
      
      const matchReg = matchesRegion(loc.country, activeRegion);
      return matchSearch && matchReg;
    });
  }, [locations, searchTerm, activeRegion]);

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white" id="locations-tab-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center md:text-left mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-left">
            <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-3 block uppercase font-bold">
              WORLDWIDE PADDOCK COORDINATES
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
              Our Global Showrooms
            </h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              From the deep harbors of Monaco to the financial towers of Tokyo and Singapore, our luxury supercars are primed and detailed for instant racetrack or city dispatch.
            </p>
          </div>
          
          {/* Diagnostic beacon indicator */}
          <div className="flex items-center space-x-2 bg-neutral-950 border border-white/5 py-2 px-4 rounded-xl self-start md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              19 Vaults Active
            </span>
          </div>
        </div>

        {/* INTERACTIVE GEOGRAPHIC VECTOR MAP PLATFORM */}
        <div 
          className="bg-neutral-950/80 p-5 rounded-3xl border border-white/5 mb-8 relative overflow-hidden shadow-2xl"
          id="showroom-vector-map-panel"
        >
          {/* Subtle design grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-2 text-left">
              <Globe className="w-4 h-4 text-gold-550" />
              <h2 className="text-xs font-mono uppercase tracking-widest font-black text-gray-300">
                Showroom Locator Map
              </h2>
            </div>
            
            {/* Legend / Tooltips or Controls */}
            <div className="flex items-center space-x-2">
              {searchTerm && (
                <button
                  onClick={handleResetMap}
                  className="px-2.5 py-1 bg-gold-550/10 border border-gold-550/20 text-gold-550 rounded-lg text-[9px] font-mono tracking-widest uppercase hover:bg-gold-550 hover:text-black transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <span className="text-[9px] font-mono text-gray-500 hidden sm:inline-block">
                Drag to pan • Scroll to zoom
              </span>
            </div>
          </div>

          <div className="relative bg-[#070707] rounded-2xl border border-white/5 h-[340px] md:h-[460px] flex items-center justify-center overflow-hidden">
            
            {mapLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-gold-550 animate-spin" />
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold">Aligning Satellite Coordinates...</p>
              </div>
            ) : mapError ? (
              <div className="flex flex-col items-center justify-center max-w-lg text-center p-6 space-y-4">
                <AlertCircle className="w-10 h-10 text-[#d4a331] animate-pulse" />
                <h3 className="text-sm font-bold text-white">Local Precision Hub Console</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Our interactive visual console could not load satellite terrain. Seamlessly navigate using our regional selection matrices and global showroom cards below.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-white/10 text-[10px] font-mono tracking-wider shadow-lg rounded-xl uppercase transition-colors text-white border border-white/5 cursor-pointer"
                >
                  Reload Coordinates
                </button>
              </div>
            ) : (
              <div className="w-full h-full cursor-grab active:cursor-grabbing relative select-none">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 125,
                    center: [15, 25]
                  }}
                  width={800}
                  height={450}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup
                    zoom={mapPosition.zoom}
                    center={mapPosition.coordinates}
                    onMoveEnd={(pos) => setMapPosition(pos)}
                    maxZoom={12}
                    minZoom={1}
                  >
                    {/* Geographies (Landmasses) */}
                    <Geographies geography={geoData}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const geoName = geo.properties.name;
                          // Check if any of our active locations matched this country
                          const hasActiveShowroom = locations.some(loc => 
                            matchesCountryGeo(geoName, loc.country)
                          );
                          const isSelectedCountry = selectedMapLocation && matchesCountryGeo(geoName, selectedMapLocation.country);

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => handleGeographyClick(geo)}
                              fill={
                                isSelectedCountry
                                  ? "#1c1913" 
                                  : hasActiveShowroom 
                                    ? "#131312" 
                                    : "#0a0a0a"
                              }
                              stroke={hasActiveShowroom ? "#d4a331/20" : "#111111"}
                              strokeWidth={0.6}
                              style={{
                                default: {
                                  fill: isSelectedCountry ? "#181510" : hasActiveShowroom ? "#111110" : "#080808",
                                  stroke: isSelectedCountry ? "#ca8a04" : hasActiveShowroom ? "#ca8a04/30" : "#ffffff/5",
                                  strokeWidth: hasActiveShowroom ? 0.8 : 0.4,
                                  outline: "none",
                                  transition: "all 300ms ease"
                                },
                                hover: {
                                  fill: hasActiveShowroom ? "#ca8a04/10" : "#111111",
                                  stroke: "#ca8a04",
                                  strokeWidth: 0.8,
                                  outline: "none",
                                  cursor: hasActiveShowroom ? "pointer" : "default"
                                },
                                pressed: {
                                  fill: "#181510",
                                  outline: "none"
                                }
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {/* Active Showroom Hotspot Pins */}
                    {locations.map((loc) => {
                      const coords = CITY_COORDINATES[loc.city];
                      if (!coords) return null; // Skip if no precise coordinates mapped

                      const isSelected = selectedMapLocation && selectedMapLocation.id === loc.id;
                      const isHovered = hoveredLocation && hoveredLocation.id === loc.id;

                      return (
                        <Marker
                          key={loc.id}
                          coordinates={coords}
                          onClick={() => handleMarkerClick(loc)}
                          onMouseEnter={() => setHoveredLocation(loc)}
                          onMouseLeave={() => setHoveredLocation(null)}
                        >
                          {/* Pulsative radar locator ring */}
                          <g className="cursor-pointer">
                            <circle
                              r={isSelected ? 10 : isHovered ? 8 : 6}
                              fill="none"
                              stroke="#ca8a04"
                              strokeWidth={0.8}
                              opacity={isSelected ? 0.9 : 0.6}
                              className={isSelected || isHovered ? "" : "animate-pulse"}
                            />
                            {/* Inner core particle */}
                            <circle
                              r={isSelected ? 4 : isHovered ? 3.5 : 2.5}
                              fill={isSelected ? "#E2B653" : isHovered ? "#ffffff" : "#ca8a04"}
                              className="transition-all duration-300"
                            />
                            {/* Accent label for selected or hovered coordinates */}
                            {(isSelected || isHovered) && (
                              <g transform="translate(0, -12)">
                                <rect
                                  x="-40"
                                  y="-15"
                                  width="80"
                                  height="18"
                                  rx="4"
                                  fill="#0a0a09"
                                  stroke="#ca8a04"
                                  strokeWidth="0.5"
                                  opacity="0.95"
                                />
                                <text
                                  textAnchor="middle"
                                  y="-3"
                                  fill="#ffffff"
                                  fontSize="7px"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                  letterSpacing="0.05em"
                                >
                                  {loc.city.toUpperCase()}
                                </text>
                              </g>
                            )}
                          </g>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>

                {/* Left floating control layout */}
                <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetMap}
                    className="p-1.5 bg-neutral-900 border border-white/5 hover:border-gold-550 rounded-lg text-gray-300 hover:text-gold-550 transition-colors cursor-pointer"
                    title="Reset Projection Focus"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right floating quick coordinates status label */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[9px] font-mono text-gray-400">
                  <span>SCALE: {Math.round(mapPosition.zoom * 100)}% • ROTATION: [0, 0]</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Floating Detail Panel Overlay */}
          <AnimatePresence>
            {selectedMapLocation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-[#0a0a0a] border border-gold-550/20 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left relative z-20"
                id="map-floating-overlay"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#d4a331] uppercase bg-[#d4a331]/10 px-2 py-0.5 rounded border border-gold-550/10">
                      {selectedMapLocation.country}
                    </span>
                    <span className="text-[9px] text-[#22c55e] font-mono tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      ACTIVE GATEWAY
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-sans flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-550" />
                    {selectedMapLocation.city} Showroom Center
                  </h3>
                  <p className="text-xs text-gray-400">{selectedMapLocation.name} — <span className="text-gray-500 italic font-mono">{selectedMapLocation.address}</span></p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto self-stretch md:self-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <button
                    onClick={() => {
                      setSelectedMapLocation(null);
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 hover:text-white rounded-xl text-xs text-gray-400 transition-colors cursor-pointer"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => onSelectLocationForFleet(selectedMapLocation.id.toString())}
                    className="flex-1 md:flex-initial flex items-center justify-center space-x-2 py-2.5 px-5 rounded-xl text-xs font-black tracking-wider bg-gold-550 text-black hover:opacity-90 transition-all shadow-md shadow-gold-550/10 cursor-pointer"
                  >
                    <span>Dispatch Fleet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Filters and Search Container */}
        <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2" id="region-buttons">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => handleRegionClick(reg.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeRegion === reg.id
                    ? 'bg-gold-550 text-black font-extrabold shadow-md'
                    : 'bg-neutral-905 border border-white/5 text-gray-450 hover:text-white hover:bg-neutral-900'
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
            {filteredLocations.map((loc, idx) => {
              const isLocSelected = selectedMapLocation && selectedMapLocation.id === loc.id;
              
              return (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                  className={`group relative bg-neutral-950 border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-56 ${
                    isLocSelected 
                      ? 'border-gold-550 shadow-lg shadow-gold-550/5' 
                      : 'border-white/5 hover:border-gold-550/30'
                  }`}
                >
                  {/* Decorative background grid effect */}
                  <div className="absolute top-4 right-4 text-gold-550/5 group-hover:text-gold-550/10 transition-colors pointer-events-none">
                    <Compass className="w-20 h-20 rotate-[15deg]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#d4a331] uppercase bg-[#d4a331]/10 px-2.5 py-1 rounded-md border border-gold-550/10">
                        {loc.country}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Veloce Fleet Online"></span>
                    </div>

                    <h3 className="text-xl font-bold font-sans text-white group-hover:text-gold-550 transition-all flex items-center gap-1.5">
                      {loc.city}
                      {isLocSelected && <Sparkles className="w-4 h-4 text-gold-550" />}
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
                    <button
                      onClick={() => {
                        const coords = CITY_COORDINATES[loc.city];
                        if (coords) {
                          setMapPosition({ coordinates: coords, zoom: 4.5 });
                        }
                        setSelectedMapLocation(loc);
                        // Scroll up smoothly to map locator
                        document.getElementById('showroom-vector-map-panel')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[10px] text-gray-400 hover:text-white transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
                    >
                      Locate on Map
                    </button>

                    <button
                      onClick={() => onSelectLocationForFleet(loc.id.toString())}
                      className="flex items-center space-x-1 py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-wider bg-gold-550/10 text-gold-550 hover:bg-gold-550 hover:text-black transition-all cursor-pointer"
                    >
                      <span>Dispatch Fleet</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-2xl max-w-md mx-auto">
            <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin-slow" />
            <h3 className="text-lg font-bold">No showroom found</h3>
            <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto">
              Our master concierge can arrange premium shipping anywhere in the world on special request. Connect immediately with our support desk.
            </p>
            <button
              onClick={handleResetMap}
              className="mt-6 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-white/10 text-[10px] font-mono tracking-widest uppercase transition-all rounded-xl border border-white/5 cursor-pointer text-white"
            >
              Reset Search Parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
