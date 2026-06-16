import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { X, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loading } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      alert("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" id="auth-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md bg-stone-900 border border-white/10 rounded-2xl overflow-hidden p-8 shadow-2xl relative"
        id="auth-modal-card"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
          id="auth-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Display */}
        <div className="text-center mb-6">
          <span className="text-3xl font-extrabold tracking-widest text-white">VELOCITY</span>
          <p className="text-red-500 font-mono text-[10px] tracking-widest uppercase mt-1">SUPERCAR RENTALS</p>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">Unlock the Garage</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Create an account or sign in to verify your driving credentials, favorite supercars, and manage elite bookings.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-neutral-100 text-black font-semibold py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-55"
            id="auth-google-btn"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.2662 9.7653C6.1996 6.9186 8.8546 4.884 12 4.884C13.881 4.884 15.5841 5.558 16.916 6.671L20.354 3.233C18.163 1.233 15.222 0 12 0C7.29 0 3.238 2.714 1.258 6.658L5.2662 9.7653Z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275C23.49 11.49 23.42 10.74 23.29 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.94 21.09C22.19 19.01 23.49 15.92 23.49 12.275Z"
              />
              <path
                fill="#FBBC05"
                d="M5.2662 14.2347C5.0112 13.4847 4.8712 12.693 4.8712 11.874C4.8712 11.055 5.0112 10.263 5.2662 9.513L1.258 6.406C0.457 8.017 0 9.807 0 11.874C0 13.941 0.457 15.731 1.258 17.342L5.2662 14.2347Z"
              />
              <path
                fill="#34A853"
                d="M12 24.0003C15.24 24.0003 18.01 22.9303 19.94 21.0903L16.08 18.1003C15.01 18.8203 13.62 19.2603 12 19.2603C8.8546 19.2603 6.1996 17.2257 5.2662 14.379L1.258 17.4863C3.238 21.4303 7.29 24.0003 12 24.0003Z"
              />
            </svg>
            <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Security / Promise Badge */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-[11px] text-gray-500 font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secure AES-256 authenticated checkout</span>
        </div>
      </motion.div>
    </div>
  );
};
