import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Home, 
  Car, 
  Calendar, 
  Gem, 
  Headphones, 
  Globe2, 
  Compass, 
  Heart, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  ShieldAlert,
  Mail
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  favoritesCount: number;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setTab, 
  favoritesCount, 
  onOpenAuth 
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'fleet', label: 'The Fleet', icon: Car },
    { id: 'trips', label: 'Reservations', icon: Calendar, requiresAuth: true },
    { id: 'membership', label: 'Membership', icon: Gem },
    { id: 'concierge', label: 'Concierge', icon: Headphones },
    { id: 'locations', label: 'Showrooms', icon: Globe2 },
    { id: 'about', label: 'Pedigree', icon: Compass },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'profile', label: 'Driver Profile', icon: UserIcon, requiresAuth: true },
  ];

  const handleTabChange = (tabId: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      onOpenAuth();
    } else {
      setTab(tabId);
    }
  };

  return (
    <aside 
      className="hidden lg:flex flex-col w-64 bg-[#0a0a09] border-r border-white/5 sticky top-0 h-screen p-6 justify-between select-none z-40"
      id="velocity-sidebar"
    >
      <div className="flex flex-col space-y-12">
        {/* Brand Logo Header */}
        <div 
          onClick={() => setTab('home')} 
          className="cursor-pointer group flex flex-col pt-2"
          id="sidebar-logo"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-550 via-white to-gold-600 tracking-wider">
              V
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-sans font-extrabold tracking-[0.25em] text-white group-hover:text-gold-550 transition-colors">
                VELOCITY
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-gray-500 uppercase">
                Supercar Club
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-1.5" id="sidebar-navigation">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id, item.requiresAuth)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 group cursor-pointer ${
                  isActive 
                    ? 'bg-neutral-900/90 text-gold-550 shadow-inner border border-white/5 font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-neutral-950'
                }`}
                id={`sidebar-item-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-gold-550 scale-110' : 'text-gray-400 group-hover:scale-105 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {/* Active Indicator or Counter badge */}
                {item.id === 'trips' && user && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-gray-300 font-mono">
                    Active
                  </span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Controls */}
      <div className="border-t border-white/5 pt-6 flex flex-col space-y-4" id="sidebar-footer">
        {user ? (
          <div className="flex flex-col space-y-4">
            {/* View Favorites tab shortcut */}
            <button
              onClick={() => handleTabChange('favorites')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'favorites' ? 'bg-neutral-900 text-red-500 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-red-600 text-red-600' : 'text-gray-400'}`} />
                <span>My Speedway</span>
              </div>
              {favoritesCount > 0 && (
                <span className="bg-red-650/10 text-red-500 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Profile Brief */}
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <img 
                  referrerPolicy="no-referrer"
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'V'}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-white/10 object-cover"
                />
                <div className="flex flex-col text-left">
                  <span className="text-white text-[11px] font-bold truncate max-w-[100px]" title={user.displayName || user.email}>
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] text-gold-550 font-mono tracking-widest uppercase">
                    Elite Tier
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => logout()}
                className="text-gray-500 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                title="Sign Out"
                id="sidebar-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-3 bg-gradient-to-r from-gold-550 to-gold-600 text-black hover:opacity-90 font-sans font-bold text-xs tracking-wider rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
            id="sidebar-sign-in-btn"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Join Showroom / Login</span>
          </button>
        )}

        {/* Service desk note */}
        <div className="text-center">
          <p className="text-[10px] text-gray-600 tracking-wide font-sans">
            24/7 Global VIP Desk:
          </p>
          <a 
            href="tel:+18002243000" 
            className="text-[10px] font-mono text-gold-550 hover:underline mt-0.5 inline-block"
          >
            +1 (800) 224-3000
          </a>
        </div>
      </div>
    </aside>
  );
};
