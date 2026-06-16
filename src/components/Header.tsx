import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LogOut, User as UserIcon, ShieldAlert, Heart, Calendar } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  favoritesCount: number;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab, favoritesCount, onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setTab('home')} 
          className="flex items-center space-x-2 cursor-pointer group"
          id="brand-logo"
        >
          <span className="text-2xl font-bold tracking-widest text-white font-sans">
            VELOCITY
          </span>
          <span className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform duration-300"></span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => setTab('home')}
            className={`text-white transition-colors hover:text-red-500 pb-1 cursor-pointer ${
              currentTab === 'home' ? 'border-b-2 border-red-600' : 'text-gray-400'
            }`}
            id="nav-home"
          >
            Home
          </button>
          <button
            onClick={() => setTab('fleet')}
            className={`text-white transition-colors hover:text-red-500 pb-1 cursor-pointer ${
              currentTab === 'fleet' ? 'border-b-2 border-red-600' : 'text-gray-400'
            }`}
            id="nav-fleet"
          >
            The Fleet
          </button>
          {user && (
            <button
              onClick={() => setTab('trips')}
              className={`text-white transition-colors hover:text-red-500 pb-1 cursor-pointer ${
                currentTab === 'trips' ? 'border-b-2 border-red-600' : 'text-gray-400'
              }`}
              id="nav-trips"
            >
              My Trips
            </button>
          )}
        </nav>

        {/* User profile controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4" id="user-controls-logged-in">
              {/* Favorites Indicator */}
              <button 
                onClick={() => setTab('favorites')}
                className="relative text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                title="Favorited Cars"
                id="header-favs-btn"
              >
                <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-red-600 text-red-600' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* View Trips Shortcut */}
              <button 
                onClick={() => setTab('trips')}
                className="text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
                title="My Reservations"
                id="header-trips-btn"
              >
                <Calendar className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-white text-xs font-semibold">{user.displayName || user.email}</span>
                  <span className="text-[10px] text-gray-400">Elite Driver</span>
                </div>
                <img 
                  referrerPolicy="no-referrer"
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'V'}`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
                
                {/* Logout */}
                <button
                  onClick={() => logout()}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                  title="Sign Out"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold tracking-wider transition-all cursor-pointer"
              id="login-btn-header"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
