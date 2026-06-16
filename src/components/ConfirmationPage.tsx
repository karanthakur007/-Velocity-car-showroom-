import React from 'react';
import { Car, PickupLocation, Reservation } from '../types.ts';
import { CheckCircle, Calendar, MapPin, Clipboard, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfirmationPageProps {
  reservation: Reservation;
  car: Car;
  location: PickupLocation;
  onClickMyTrips: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  reservation,
  car,
  location,
  onClickMyTrips,
}) => {

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(reservation.confirmationCode);
    alert("Confirmation code copied to clipboard: " + reservation.confirmationCode);
  };

  return (
    <div className="bg-black text-white min-h-screen py-20 flex items-center justify-center" id="confirmation-page">
      <div className="max-w-xl w-full px-4 text-center">
        
        {/* Animated Check badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-20 h-20 bg-emerald-950/80 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>

        {/* Text descriptions */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Booking Confirmed!</h1>
        <p className="text-gray-400 text-sm md:text-base mb-8 max-w-sm mx-auto">
          Welcome to the club. Your high-performance supercar is being meticulously detailed and specced.
        </p>

        {/* Key Card confirmation box */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4 shadow-xl" id="confirmation-summary-card">
          
          {/* Conf code */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block">Confirmation Code</span>
              <span className="text-xl font-bold font-mono text-white tracking-widest">{reservation.confirmationCode}</span>
            </div>
            <button
              onClick={copyCodeToClipboard}
              className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-gray-300 transition-all cursor-pointer border border-white/5"
              title="Copy reservation code"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>

          {/* Model information */}
          <div className="flex items-center space-x-4 bg-black/40 p-3 rounded-lg border border-white/5">
            <img
              src={car.photos[0]}
              alt={`${car.brand} ${car.model}`}
              className="w-14 h-10 object-cover rounded"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-white text-sm">{car.brand} {car.model}</h4>
              <p className="text-[10px] text-gray-500 font-mono">{car.year} Master Build</p>
            </div>
          </div>

          {/* Dates & Location summary */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-400">
            <div>
              <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">SPOT</span>
              <div className="flex items-center gap-1 text-white font-sans text-xs">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{location.city}</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">RENTAL DURATION</span>
              <div className="flex items-center gap-1 text-white font-sans text-xs">
                <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{reservation.rentalDays} {reservation.rentalDays === 1 ? "Day" : "Days"}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 text-xs font-mono text-gray-400 flex items-center justify-between">
            <span>DUE ON DELIVERY</span>
            <strong className="text-lg font-bold text-white font-sans">${reservation.totalPrice.toLocaleString()}</strong>
          </div>

        </div>

        {/* Call to actions */}
        <button
          onClick={onClickMyTrips}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-650/10 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
          id="confirm-goto-trips"
        >
          <span>Add to My Trips / View Trips</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
