import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase.ts';
import { 
  User, 
  Mail, 
  Camera, 
  ShieldCheck, 
  Award, 
  Activity, 
  Check, 
  AlertCircle, 
  Clock, 
  Flame,
  Zap
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { user } = useAuth();
  
  // Local state for editable fields
  const [displayName, setDisplayName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load user data on mount/change
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      // If of the format dicebear, extract seed or use email default
      if (user.photoURL && user.photoURL.includes('seed=')) {
        const seedValue = user.photoURL.split('seed=')[1] || '';
        setAvatarSeed(decodeURIComponent(seedValue));
      } else {
        setAvatarSeed(user.displayName || user.email?.split('@')[0] || 'Schumacher');
      }
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsUpdating(true);
    setNotification(null);

    try {
      // Build Dicebear URL based on chosen seed
      const generatedPhotoURL = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed || displayName || 'V')}`;
      
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: generatedPhotoURL
      });

      // Force refresh user profile
      await auth.currentUser.reload();
      
      setNotification({
        type: 'success',
        message: 'Telemetry updated. Driver profile is now certified.'
      });

      // Clear successful alert after 4s
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update credentials. Please re-verify.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Safe check if logged out
  if (!user) {
    return (
      <div className="bg-black min-h-screen py-20 px-4 text-center text-white flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="p-4 bg-neutral-950 border border-white/5 rounded-3xl inline-flex">
            <User className="w-12 h-12 text-gold-550 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight">VIP Driver Profile Required</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Please register or authorize your account via the elite registry portal in the header menu to manage racing status, check supercar telemetry records, and edit physical credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white text-left" id="profile-tab-root">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-10 text-left">
          <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-2 block uppercase font-bold">
            RACETRACK TELEMETRY
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Driver Credentials
          </h1>
          <p className="text-gray-400 text-xs mt-2 max-w-xl">
            Update your verified driver telemetry. These details are synchronized and cross-matched with airport paddock dispatch agents upon delivery.
          </p>
        </div>

        {/* Dashboard Grid Splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Live Supercar License badge */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-950 border border-white/5 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-550/5 rounded-full blur-2xl"></div>
              
              {/* Giant Avatar Display */}
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-white/10 p-1 overflow-hidden flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-350">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed || displayName || 'V')}`}
                    alt="Driver Avatar" 
                    className="w-full h-full rounded-xl object-cover bg-neutral-900" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gold-550 rounded-lg p-1.5 border-2 border-neutral-950 text-black shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Identity labels */}
              <h3 className="font-display text-lg font-bold text-white truncate max-w-full">
                {user.displayName || 'Uncertified Pilot'}
              </h3>
              <p className="text-[10px] font-mono text-gray-400 truncate max-w-full mt-0.5">{user.email}</p>

              <div className="h-[1px] bg-white/5 w-full my-5"></div>

              {/* Racetrack Profile Statistics / Badges */}
              <div className="w-full space-y-3.5 text-left">
                
                <div className="flex items-center justify-between text-xs bg-black p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold-550" /> Speed Class
                  </span>
                  <span className="font-mono font-bold text-gold-550 uppercase tracking-widest bg-gold-550/10 px-2 py-0.5 rounded text-[10px] border border-gold-550/20">
                    GT3 Certified
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-black p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500" /> Hot Laps
                  </span>
                  <span className="font-mono text-white text-[11px] font-bold">
                    8 Consecutive
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-black p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" /> Member Since
                  </span>
                  <span className="font-mono text-gray-300 text-[11px] font-bold">
                    June 2026
                  </span>
                </div>

              </div>

              {/* Security validation */}
              <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Paddock Entry Clearance Active</span>
              </div>

            </div>
          </div>

          {/* Right panel: Editable Profile Form */}
          <div className="lg:col-span-8">
            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/5">
              
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-gold-550" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-bold">
                  Edit Pilot Credentials
                </h2>
              </div>

              {/* Notifications banner */}
              {notification && (
                <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 border text-xs leading-relaxed ${
                  notification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {notification.type === 'success' ? (
                    <Check className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  )}
                  <span>{notification.message}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* Email (Read Only Visual Block) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Primary Account Link (Unchangeable)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-650" />
                    <input
                      disabled
                      type="text"
                      value={user.email || ''}
                      className="w-full bg-black/60 border border-white/5 text-gray-500 rounded-xl py-3.5 pl-10 pr-4 text-xs select-none cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                {/* Display Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Certified Display Pilot Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ayrton Senna"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">This display name will appear in custom racing dashboards and secure order logs.</p>
                </div>

                {/* Avatar Seed Generation */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Avatar Design Seed Key
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      required
                      type="text"
                      placeholder="Change seed to generate unique custom vector initials"
                      value={avatarSeed}
                      onChange={(e) => setAvatarSeed(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white font-mono focus:outline-none focus:border-gold-550 transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Change this word to dynamically randomize premium vector emblem visuals based on initials matching.</p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold tracking-wider text-xs transition-all cursor-pointer bg-gold-550 text-black hover:opacity-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Transmitting Telemetry...
                    </span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Commit Telemetry Changes</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
