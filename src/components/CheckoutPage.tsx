import React, { useState } from 'react';
import { Car, PickupLocation } from '../types.ts';
import { Shield, Sparkles, MapPin, Calendar, CreditCard, User, Mail,Phone, FileText, Gift } from 'lucide-react';

interface CheckoutPageProps {
  car: Car;
  location: PickupLocation;
  pickupDate: string;
  returnDate: string;
  onSubmitCheckout: (driverDetails: {
    driverName: string;
    driverEmail: string;
    driverPhone: string;
    driverLicense: string;
    driverDob: string;
    insuranceSelected: boolean;
    chauffeurSelected: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  userEmail?: string;
  userDisplayName?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  car,
  location,
  pickupDate,
  returnDate,
  onSubmitCheckout,
  onCancel,
  userEmail = '',
  userDisplayName = '',
}) => {
  // Addon states
  const [insurance, setInsurance] = useState(false);
  const [chauffeur, setChauffeur] = useState(false);

  // Driver details state
  const [driverName, setDriverName] = useState(userDisplayName || '');
  const [driverEmail, setDriverEmail] = useState(userEmail || '');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverDob, setDriverDob] = useState('');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Calculations
  const pDate = new Date(pickupDate);
  const rDate = new Date(returnDate);
  const diffTime = rDate.getTime() - pDate.getTime();
  const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const basePrice = car.dailyRate * rentalDays;
  let dailyAddonCost = 0;
  if (insurance) dailyAddonCost += 50;
  if (chauffeur) dailyAddonCost += 150;
  const addonsPrice = dailyAddonCost * rentalDays;

  const subtotal = basePrice + addonsPrice;
  const taxesAndFees = Math.round(subtotal * 0.1) + 100;
  const totalPrice = subtotal + taxesAndFees;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!driverName || !driverEmail || !driverPhone || !driverLicense || !driverDob) {
      setFormError("Please fill in all driver details to secure this supercar.");
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      await onSubmitCheckout({
        driverName,
        driverEmail,
        driverPhone,
        driverLicense,
        driverDob,
        insuranceSelected: insurance,
        chauffeurSelected: chauffeur,
      });
    } catch (error: any) {
      setFormError(error.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen py-16 text-white" id="checkout-page-root">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="mb-12 border-b border-white/10 pb-6">
          <span className="font-mono text-red-500 text-xs tracking-widest uppercase block mb-2">SECURE VELOCITY RESERVATION</span>
          <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>
        </div>

        {/* Layout split: Form vs Itemized Bill */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="checkout-split-layout">
          
          {/* Column 1: Fill Forms */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleCheckoutSubmit} className="space-y-8">
              
              {/* 1. Driver Credentials Form Section */}
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <User className="w-5 h-5 text-red-500" />
                  Driver Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-2 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Johnathan Doe"
                        className="bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 w-full"
                        required
                        id="driver-name-input"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-2 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={driverEmail}
                        onChange={(e) => setDriverEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 w-full"
                        required
                        id="driver-email-input"
                      />
                    </div>
                  </div>

                  {/* Phone Connection */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-2 uppercase">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="+1 (555) 0192"
                        className="bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 w-full"
                        required
                        id="driver-phone-input"
                      />
                    </div>
                  </div>

                  {/* Birth day */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 mb-2 uppercase">Date of Birth</label>
                    <input
                      type="date"
                      value={driverDob}
                      onChange={(e) => setDriverDob(e.target.value)}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                      required
                      id="driver-dob-input"
                    />
                  </div>

                  {/* License Number */}
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-xs font-mono text-gray-400 mb-2 uppercase">Driver's License Number</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={driverLicense}
                        onChange={(e) => setDriverLicense(e.target.value)}
                        placeholder="DL-XXXXXXXXX (U.S., EU or International License)"
                        className="bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 w-full"
                        required
                        id="driver-license-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Premium VIP Add-ons selection */}
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  Premium VIP Add-ons
                </h3>

                <div className="space-y-4">
                  {/* Insurance option */}
                  <label 
                    onClick={() => setInsurance(!insurance)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      insurance ? 'bg-red-950/20 border-red-600/40' : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={insurance}
                      onChange={() => {}} // handled via label click
                      className="mt-1 accent-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-white text-sm">Full Premium Cover & Insurance Shield</h4>
                        <span className="font-mono text-red-500 text-xs font-bold">+$50 / day</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Zero deductible collision damage waiver, comprehensive physical protection, tire risk shield, glass protection, and local legal road advisory liability.
                      </p>
                    </div>
                  </label>

                  {/* Chauffeur Option */}
                  <label 
                    onClick={() => setChauffeur(!chauffeur)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      chauffeur ? 'bg-red-950/20 border-red-600/40' : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={chauffeur}
                      onChange={() => {}} // handled via label click
                      className="mt-1 accent-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-white text-sm">Dedicated Personal Chauffeur Companion</h4>
                        <span className="font-mono text-red-500 text-xs font-bold">+$150 / day</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Enjoy the extreme luxury of a professional, multilingual performance-trained chauffeur to navigate around tricky high-traffic cities. Perfect for night galas.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              {formError && (
                <p className="text-red-500 font-mono text-xs text-center">{formError}</p>
              )}

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-4 bg-neutral-850 hover:bg-neutral-800 text-gray-300 font-bold rounded-xl text-sm transition-all text-center cursor-pointer border border-white/5"
                  id="checkout-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all text-center cursor-pointer shadow-lg shadow-red-600/10 hover:shadow-red-600/20 disabled:opacity-55"
                  id="checkout-submit-btn"
                >
                  {submitting ? 'Verifying Availability...' : 'Confirm Reservation'}
                </button>
              </div>

            </form>
          </div>

          {/* Column 2: Itemized Bill Breakdown */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-24 space-y-6">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6" id="bill-receipt-card">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                Booking Receipt
              </h3>

              {/* Brief car details summary */}
              <div className="flex items-center space-x-4 bg-black/40 p-4 rounded-xl border border-white/5">
                <img
                  src={car.photos[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-16 h-12 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{car.brand} {car.model}</h4>
                  <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">{car.year} Specced Hypercar</p>
                </div>
              </div>

              {/* Summary details */}
              <div className="space-y-3.5 text-xs font-mono text-gray-400">
                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Spot:
                  </span>
                  <span className="text-white font-sans text-xs font-semibold">{location.city} ({location.name})</span>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    Pickup:
                  </span>
                  <span className="text-white font-sans text-xs font-semibold">{pickupDate}</span>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    Return:
                  </span>
                  <span className="text-white font-sans text-xs font-semibold">{returnDate}</span>
                </div>
              </div>

              {/* Bill Details */}
              <div className="border-t border-white/5 pt-6 space-y-4 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Rental rate ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</span>
                  <span className="text-white font-sans font-medium">${basePrice.toLocaleString()}</span>
                </div>

                {insurance && (
                  <div className="flex justify-between">
                    <span>VIP Collision Cover</span>
                    <span className="text-white font-sans font-medium">${(50 * rentalDays).toLocaleString()}</span>
                  </div>
                )}

                {chauffeur && (
                  <div className="flex justify-between">
                    <span>Companion Driver</span>
                    <span className="text-white font-sans font-medium">${(150 * rentalDays).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span>Advisories, Taxes & Suite Valet</span>
                  <span className="text-white font-sans font-medium">${taxesAndFees.toLocaleString()}</span>
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-end pt-2 text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 font-mono">GRAND TOTAL DUE</span>
                    <p className="text-xs text-gray-500 mt-0.5">All local customs inclusive</p>
                  </div>
                  <strong className="text-3xl font-extrabold font-sans">${totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              {/* Security promise block */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 text-[11px] text-gray-500 leading-normal flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  Velocity holds authorization for incidental protection. Safe driving terms apply. All drivers must carry valid ID and physical driver licenses upon direct suite delivery.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
