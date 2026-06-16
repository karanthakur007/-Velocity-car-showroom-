import React from 'react';
import { Reservation } from '../types.ts';
import { ShieldCheck, MapPin, Calendar, Compass, User, CreditCard, Sparkles } from 'lucide-react';

interface MyTripsPageProps {
  tripsList: Reservation[];
  onBrowseFleet: () => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ tripsList, onBrowseFleet }) => {
  // Current date for split logic (current mock date in system is June 15, 2026)
  const todayStr = "2026-06-15";

  // Split into upcoming vs past
  const upcomingTrips = tripsList.filter((t) => t.pickupDate >= todayStr && t.status === 'confirmed');
  const pastTrips = tripsList.filter((t) => t.pickupDate < todayStr || t.status === 'cancelled');

  return (
    <div className="bg-black text-white min-h-screen py-16" id="my-trips-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header summary */}
        <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-red-500 uppercase tracking-widest block mb-2">DRIVER LOGS</span>
            <h1 className="text-4xl font-extrabold tracking-tight">My Reservations</h1>
          </div>
          <button
            onClick={onBrowseFleet}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer w-fit"
            id="trips-browse-fleet-btn"
          >
            Browse New Supercars
          </button>
        </div>

        {tripsList.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-neutral-900 border border-white/10 rounded-2xl max-w-xl mx-auto" id="trips-empty-state">
            <Compass className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Garage is Empty</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
              You haven't reserved any supercars yet. Browse the Velocity elite fleet today and drive the extraordinary.
            </p>
            <button
              onClick={onBrowseFleet}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-colors"
            >
              Unlock a Supercar
            </button>
          </div>
        ) : (
          <div className="space-y-12" id="trips-content-layout">
            
            {/* 1. Upcoming Expeditions Section */}
            {upcomingTrips.length > 0 && (
              <div className="space-y-6" id="upcoming-trips-section">
                <h2 className="text-xl font-bold tracking-tight text-white font-sans uppercase text-rose-500 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-550" />
                  Upcoming Deliveries ({upcomingTrips.length})
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  {upcomingTrips.map((trip) => (
                    <div 
                      key={trip.id}
                      className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12"
                      id={`trip-card-${trip.id}`}
                    >
                      {/* Car Thumbnail Image Section (cols-4) */}
                      <div className="md:col-span-4 relative aspect-video md:aspect-auto">
                        <img 
                          src={trip.car?.photos[0] || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop"} 
                          alt="Supercar" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded-md">
                          Confirmed active
                        </div>
                      </div>

                      {/* Content summary details (cols-8) */}
                      <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        
                        {/* Row 1: Brand & Confirmation Code */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                              {trip.car?.brand} {trip.car?.model}
                            </h3>
                            <p className="text-gray-400 text-xs font-mono">{trip.car?.year} Custom Specs</p>
                          </div>
                          <div className="bg-black/40 px-3.5 py-1.5 rounded-lg border border-white/5 h-fit font-mono text-xs text-center sm:text-right">
                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">RESERVATION CODE</span>
                            <span className="text-white font-bold tracking-widest">{trip.confirmationCode}</span>
                          </div>
                        </div>

                        {/* Row 2: Location and Dates grids */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-gray-300">
                          <div className="flex items-start gap-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-gray-500 text-[10px] uppercase block">DEL_HOTSPOT</span>
                              <span className="text-white font-sans text-xs font-semibold">{trip.location?.name}, {trip.location?.city}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
                            <Calendar className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-gray-500 text-[10px] uppercase block">DUR_TIMING ({trip.rentalDays} {trip.rentalDays === 1 ? 'day' : 'days'})</span>
                              <span className="text-white font-sans text-xs font-semibold">{trip.pickupDate} to {trip.returnDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Driver Summary & Total Pay */}
                        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-gray-400 self-start">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>Driver: <strong className="text-white font-sans font-medium text-xs">{trip.driverName}</strong></span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wider">TOTAL INCLUSIVE:</span>
                            <span className="text-xl font-bold font-sans text-white">${trip.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Historic Voyages Section */}
            {pastTrips.length > 0 && (
              <div className="space-y-6" id="past-trips-section">
                <h2 className="text-xl font-bold tracking-tight text-gray-400 font-sans uppercase text-gray-500 tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gray-650" />
                  Historic Voyages / Cancelled ({pastTrips.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastTrips.map((trip) => (
                    <div 
                      key={trip.id}
                      className="bg-neutral-900/60 border border-white/5 rounded-2xl overflow-hidden p-6 hover:border-white/10 transition-colors"
                      id={`past-trip-card-${trip.id}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-white text-lg">
                            {trip.car?.brand} {trip.car?.model}
                          </h4>
                          <p className="text-gray-500 font-mono text-[10px] mt-0.5">
                            {trip.pickupDate} to {trip.returnDate}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono tracking-wider font-bold uppercase rounded p-1 text-gray-400 bg-neutral-800 border border-white/5">
                          {trip.status === 'cancelled' ? 'cancelled' : 'completed'}
                        </span>
                      </div>

                      <div className="space-y-4 text-xs font-mono text-gray-400 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between">
                          <span>CODE:</span>
                          <span className="text-white tracking-wider font-semibold">{trip.confirmationCode}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>HOTSPOT:</span>
                          <span className="text-white font-sans font-medium">{trip.location?.city}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ITEMIZED TOTAL:</span>
                          <span className="text-white font-sans font-bold">${trip.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
