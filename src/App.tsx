import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { FleetPage } from './components/FleetPage.tsx';
import { CarDetailPage } from './components/CarDetailPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { ConfirmationPage } from './components/ConfirmationPage.tsx';
import { MyTripsPage } from './components/MyTripsPage.tsx';

// Dynamic newly added luxury tab sheets
import { LocationsTab } from './components/LocationsTab.tsx';
import { MembershipTab } from './components/MembershipTab.tsx';
import { ConciergeTab } from './components/ConciergeTab.tsx';
import { AboutTab } from './components/AboutTab.tsx';

import { Car, PickupLocation, Destination, Reservation } from './types.ts';
import { 
  Sparkles, 
  Heart, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon, 
  LogOut 
} from 'lucide-react';

function DashboardOrchestrator() {
  const { user, token, logout } = useAuth();

  // Tab State: 'home' | 'fleet' | 'details' | 'checkout' | 'confirmation' | 'trips' | 'favorites' | 'membership' | 'concierge' | 'locations' | 'about'
  const [tab, setTab] = useState<string>('home');

  // Loading / Error state
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Loaded database elements
  const [carsList, setCarsList] = useState<Car[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userTrips, setUserTrips] = useState<Reservation[]>([]);

  // Page specific details
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedCarUnavailableDates, setSelectedCarUnavailableDates] = useState<{ pickupDate: string; returnDate: string }[]>([]);
  const [initiatedLocationId, setInitiatedLocationId] = useState<string>('');
  const [initiatedPickupDate, setInitiatedPickupDate] = useState<string>('');
  const [initiatedReturnDate, setInitiatedReturnDate] = useState<string>('');

  const [checkoutLocation, setCheckoutLocation] = useState<PickupLocation | null>(null);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  // Top header search query string
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  // Auth Modal trigger
  const [authOpen, setAuthOpen] = useState(false);

  // Responsive Mobile Menu collapse
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // 1. Initial Load of public data
  useEffect(() => {
    async function fetchStaticData() {
      try {
        setLoading(true);
        const [carsRes, locsRes, destsRes] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/locations'),
          fetch('/api/destinations'),
        ]);

        if (!carsRes.ok || !locsRes.ok || !destsRes.ok) {
          throw new Error("Failed to load Velocity catalog from Cloud SQL");
        }

        const carsData = await carsRes.json();
        const locsData = await locsRes.json();
        const destsData = await destsRes.json();

        setCarsList(carsData);
        setLocations(locsData);
        setDestinations(destsData);
        setErrorMsg('');
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Velocity servers are currently under maintenance. Please try again soon.");
      } finally {
        setLoading(false);
      }
    }
    fetchStaticData();
  }, []);

  // 2. Fetch authenticated data whenever token refresh occurs
  useEffect(() => {
    if (!token) {
      setFavorites([]);
      setUserTrips([]);
      return;
    }

    async function fetchUserData() {
      try {
        const [favRes, tripsRes] = await Promise.all([
          fetch('/api/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/reservations/user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (favRes.ok) {
          const favs = await favRes.json();
          setFavorites(favs);
        }
        if (tripsRes.ok) {
          const trips = await tripsRes.json();
          setUserTrips(trips);
        }
      } catch (err) {
        console.error("Error loading user-specific details:", err);
      }
    }
    fetchUserData();
  }, [user, token]);

  // Search actions from Hero Widget
  const handleHeroSearchSubmit = (params: { locationId: string; pickupDate: string; returnDate: string }) => {
    setInitiatedLocationId(params.locationId);
    setInitiatedPickupDate(params.pickupDate);
    setInitiatedReturnDate(params.returnDate);
    setTab('fleet');
  };

  // Toggle favorite car
  const handleToggleFavorite = async (carId: number) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/cars/${carId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.favorited) {
          setFavorites((prev) => [...prev, carId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== carId));
        }
      }
    } catch (err) {
      console.error("Toggle favorite failed:", err);
    }
  };

  // Direct checkout setup and verification
  const handleInitiateBooking = (params: {
    carId: number;
    pickupLocationId: number;
    pickupDate: string;
    returnDate: string;
  }) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    const loc = locations.find((l) => l.id === params.pickupLocationId);
    if (!loc) return;

    setInitiatedLocationId(params.pickupLocationId.toString());
    setInitiatedPickupDate(params.pickupDate);
    setInitiatedReturnDate(params.returnDate);
    setCheckoutLocation(loc);
    setTab('checkout');
  };

  // View individual supercar details
  const handleCarSelect = async (car: Car) => {
    try {
      setSelectedCar(car);
      setTab('details');

      // Fetch unavailable dates in parallel
      const res = await fetch(`/api/cars/${car.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCarUnavailableDates(data.unavailableDates);
      }
    } catch (err) {
      console.error("Failed to load details for " + car.model, err);
    }
  };

  // Handle final checkout confirmation
  const handleConfirmCheckout = async (driverDetails: {
    driverName: string;
    driverEmail: string;
    driverPhone: string;
    driverLicense: string;
    driverDob: string;
    insuranceSelected: boolean;
    chauffeurSelected: boolean;
  }) => {
    if (!selectedCar || !initiatedLocationId || !initiatedPickupDate || !initiatedReturnDate || !token) {
      throw new Error("Missing prerequisite parameters.");
    }

    const payload = {
      carId: selectedCar.id,
      pickupLocationId: parseInt(initiatedLocationId),
      pickupDate: initiatedPickupDate,
      returnDate: initiatedReturnDate,
      ...driverDetails,
    };

    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Overlapping booking validation failed.");
    }

    const completeReservation = await res.json();
    setActiveReservation(completeReservation);

    // Refresh trips in parallel
    const tripsRes = await fetch('/api/reservations/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (tripsRes.ok) {
      const updatedTrips = await tripsRes.json();
      setUserTrips(updatedTrips);
    }

    setTab('confirmation');
  };

  const navigateToMyTrips = () => {
    setTab('trips');
  };

  // Top Bar Real-time Search redirection trigger
  const handleTopBarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;
    
    // Switch to fleet tab and preselect searching keywords
    setTab('fleet');
    setMobileMenuOpen(false);
  };

  // Handle direct navigation requests from interactive maps
  const handleSelectLocationForFleet = (locationId: string) => {
    setInitiatedLocationId(locationId);
    setTab('fleet');
  };

  const favoritedCarsFiltered = carsList.filter((c) => favorites.includes(c.id));

  const allBookingsFlatList = React.useMemo(() => {
    return userTrips.map(ut => ({
      carId: ut.carId,
      pickupDate: ut.pickupDate,
      returnDate: ut.returnDate,
      status: ut.status,
    }));
  }, [userTrips]);

  const changeTabWithAuthCheck = (targetTab: string) => {
    setMobileMenuOpen(false);
    if (!user && (targetTab === 'trips' || targetTab === 'favorites')) {
      setAuthOpen(true);
    } else {
      setTab(targetTab);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex font-sans">
      
      {/* 1. DESKTOP STICKY SIDEBAR NAVIGATION */}
      <Sidebar 
        currentTab={tab} 
        setTab={(t) => changeTabWithAuthCheck(t)} 
        favoritesCount={favorites.length}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* 2. RIGHT PANEL CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen bg-black overflow-x-hidden">
        
        {/* PREMIUM PANEL HEADER TOP-BAR */}
        <header className="sticky top-0 z-30 bg-black/85 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile brand header (shown on small devices only) */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span 
              onClick={() => setTab('home')}
              className="text-lg font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-550 to-gold-600 block cursor-pointer"
            >
              VELOCITY
            </span>
          </div>

          {/* Desktop Search input matching layout specifications */}
          <form 
            onSubmit={handleTopBarSearch}
            className="hidden lg:flex items-center relative max-w-md w-full"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search for a supercar (e.g. Ferrari SF90, Lambo, Porsche)..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-white/5 hover:border-white/10 rounded-xl py-2 px-10 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors"
            />
          </form>

          {/* Profile controls stack */}
          <div className="flex items-center space-x-4">
            
            {/* Showroom Membership portal clicker */}
            <button
              onClick={() => setTab('membership')}
              className="hidden sm:inline-block px-4 py-2 border border-gold-550/30 hover:border-gold-550 bg-gold-550/5 hover:bg-gold-550/10 text-gold-550 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer"
            >
              Become a Member
            </button>

            {/* Notifications mock bell */}
            <button 
              className="p-2 text-gray-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-all cursor-pointer relative"
              title="Notifications"
              onClick={() => alert("Velocity Lounge: You have 1 unread notification: 'Paddock access granted.'")}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-550"></span>
            </button>

            {/* Account Status brief */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-neutral-900 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/5"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'V'}`} 
                    alt="User photo"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {/* Logged in custom Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-neutral-950 border border-white/5 rounded-2xl shadow-2xl p-2.5 z-50 text-left">
                    <div className="p-2 border-b border-white/5 mb-2">
                      <p className="text-xs text-white font-bold truncate">{user.displayName || user.email}</p>
                      <p className="text-[10px] text-gold-550 font-mono tracking-widest mt-0.5 uppercase">VIP DRIVER</p>
                    </div>

                    <button
                      onClick={() => { setUserDropdownOpen(false); setTab('trips'); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer block"
                    >
                      Reservations History
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); setTab('favorites'); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer block"
                    >
                      My Favorites Speedway
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); logout(); }}
                      className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-550/15 rounded-lg transition-colors cursor-pointer flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4.5 py-2 bg-neutral-905 hover:bg-neutral-900 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

          </div>
        </header>

        {/* MOBILE SLIDE-OUT MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/95 z-50 p-6 flex flex-col justify-between">
            <div className="space-y-8 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-display font-black tracking-widest text-[#E2B653]">VELOCITY</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4 text-lg font-sans font-bold">
                <button onClick={() => changeTabWithAuthCheck('home')} className="text-left text-white hover:text-gold-550 py-1">Home</button>
                <button onClick={() => changeTabWithAuthCheck('fleet')} className="text-left text-white hover:text-gold-550 py-1">The Fleet</button>
                <button onClick={() => changeTabWithAuthCheck('trips')} className="text-left text-white hover:text-gold-550 py-1">My Reservations</button>
                <button onClick={() => changeTabWithAuthCheck('membership')} className="text-left text-white hover:text-gold-550 py-1">Membership</button>
                <button onClick={() => changeTabWithAuthCheck('concierge')} className="text-left text-white hover:text-gold-550 py-1">Concierge</button>
                <button onClick={() => changeTabWithAuthCheck('locations')} className="text-left text-white hover:text-gold-550 py-1">World Showrooms</button>
                <button onClick={() => changeTabWithAuthCheck('about')} className="text-left text-white hover:text-gold-550 py-1">Brand Pedigree</button>
                {user && (
                  <button onClick={() => changeTabWithAuthCheck('favorites')} className="text-left text-red-500 py-1">My Speedway (Favorites)</button>
                )}
              </div>
            </div>

            {user ? (
              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'V'}`} 
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-white/10"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{user.displayName || user.email}</p>
                    <p className="text-xs text-gold-550">Elite Driver</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="p-2.5 text-gray-400 hover:text-red-500 flex items-center space-x-1"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
                className="w-full py-4 bg-gradient-to-r from-gold-550 to-gold-600 text-black font-sans font-bold text-sm tracking-wider rounded-xl transition-all"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}

        {/* 3. Primary Loading / Error Panels / Active Routers */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40" id="main-global-loader">
            <div className="w-10 h-10 rounded-full border-4 border-gold-550 border-t-transparent animate-spin mb-4"></div>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold">Unlocking Showroom Vault...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 py-32" id="main-global-error">
            <p className="text-red-500 font-mono text-sm mb-4 leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-white/5 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              Reconnect
            </button>
          </div>
        ) : (
          <main className="flex-grow">
            
            {/* View - LandingPage */}
            {tab === 'home' && (
              <LandingPage
                locations={locations}
                destinations={destinations}
                featuredCars={carsList}
                favorites={favorites}
                onCarSelect={handleCarSelect}
                onSearchSubmit={handleHeroSearchSubmit}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* View - FleetPage (with search query keyword bind) */}
            {tab === 'fleet' && (
              <FleetPage
                carsList={headerSearchQuery 
                  ? carsList.filter(car => 
                      car.brand.toLowerCase().includes(headerSearchQuery.toLowerCase()) || 
                      car.model.toLowerCase().includes(headerSearchQuery.toLowerCase())
                    )
                  : carsList
                }
                favorites={favorites}
                selectedLocation={initiatedLocationId}
                pickupDate={initiatedPickupDate}
                returnDate={initiatedReturnDate}
                onCarSelect={handleCarSelect}
                onToggleFavorite={handleToggleFavorite}
                reservations={allBookingsFlatList}
              />
            )}

            {/* View - CarDetailPage */}
            {tab === 'details' && selectedCar && (
              <CarDetailPage
                car={selectedCar}
                locations={locations}
                unavailableDates={selectedCarUnavailableDates}
                initialLocationId={initiatedLocationId}
                initialPickupDate={initiatedPickupDate}
                initialReturnDate={initiatedReturnDate}
                onBackToFleet={() => setTab('fleet')}
                onInitiateBooking={handleInitiateBooking}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}

            {/* View - CheckoutPage */}
            {tab === 'checkout' && selectedCar && checkoutLocation && (
              <CheckoutPage
                car={selectedCar}
                location={checkoutLocation}
                pickupDate={initiatedPickupDate}
                returnDate={initiatedReturnDate}
                onSubmitCheckout={handleConfirmCheckout}
                onCancel={() => setTab('details')}
                userEmail={user?.email || ''}
                userDisplayName={user?.displayName || ''}
              />
            )}

            {/* View - ConfirmationPage */}
            {tab === 'confirmation' && activeReservation && selectedCar && checkoutLocation && (
              <ConfirmationPage
                reservation={activeReservation}
                car={selectedCar}
                location={checkoutLocation}
                onClickMyTrips={navigateToMyTrips}
              />
            )}

            {/* View - MyTripsPage */}
            {tab === 'trips' && (
              <MyTripsPage
                tripsList={userTrips}
                onBrowseFleet={() => setTab('fleet')}
              />
            )}

            {/* View - MembershipTab */}
            {tab === 'membership' && (
              <MembershipTab />
            )}

            {/* View - ConciergeTab */}
            {tab === 'concierge' && (
              <ConciergeTab />
            )}

            {/* View - LocationsTab */}
            {tab === 'locations' && (
              <LocationsTab 
                locations={locations} 
                onSelectLocationForFleet={handleSelectLocationForFleet}
              />
            )}

            {/* View - AboutTab */}
            {tab === 'about' && (
              <AboutTab />
            )}

            {/* View - Favorites Tab */}
            {tab === 'favorites' && (
              <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-left" id="favorites-tab-root">
                <div className="max-w-7xl mx-auto">
                  <span className="font-mono text-gold-550 text-xs tracking-widest block mb-2 uppercase font-bold">MY PADDOCK</span>
                  <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-10">Favorited Supercars</h1>

                  {favoritedCarsFiltered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {favoritedCarsFiltered.map((car) => (
                        <div 
                          key={car.id} 
                          onClick={() => handleCarSelect(car)}
                          className="group bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden transition-all duration-350 hover:scale-[1.01] hover:border-white/15 flex flex-col shadow-lg cursor-pointer"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(car.id);
                              }}
                              className="absolute top-4 right-4 bg-black/60 text-red-500 rounded-full p-2 border border-white/10 cursor-pointer"
                            >
                              <Heart className="w-4 h-4 fill-red-650" />
                            </button>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="text-base font-bold text-white group-hover:text-gold-550 transition-colors">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-gray-500 font-mono text-[9px] uppercase tracking-wider mt-1">{car.engine}</p>
                            
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                              <span className="font-sans font-extrabold text-white">${car.dailyRate.toLocaleString()} / day</span>
                              <span className="text-[10px] text-gold-550 font-bold uppercase tracking-widest flex items-center gap-1">
                                Inspect Spec <Sparkles className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-2xl max-w-lg mx-auto">
                      <Heart className="w-12 h-12 text-gold-550 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-lg font-bold">No Favorites Saved</h3>
                      <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto mb-6 leading-relaxed">
                        Hold or tap the heart icons on any of our luxury supercars to catalog them here for instant, customized racetrack deliveries.
                      </p>
                      <button
                        onClick={() => setTab('fleet')}
                        className="px-6 py-3 bg-gradient-to-r from-gold-550 to-gold-600 text-black text-xs font-extrabold tracking-widest rounded-xl uppercase hover:opacity-90 transition-all cursor-pointer"
                      >
                        Browse Fleet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        )}
      </div>

      {/* 4. Global Auth Gate Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardOrchestrator />
    </AuthProvider>
  );
}
