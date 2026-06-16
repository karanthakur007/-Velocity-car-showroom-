import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  PhoneCall, 
  MapPin, 
  CheckCircle, 
  Send, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactTab: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'VIP Fleet Acquisiton',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate premium API dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'VIP Fleet Acquisiton',
        message: ''
      });
      // Reset submission message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleQuickInquiry = (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
  };

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white" id="contact-tab-root">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-left">
            <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-3 block uppercase font-bold">
              ESTABLISH VIP CONTACT
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
              VIP Contact Hub
            </h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Connect directly with our elite service directors and regional operations managers. Expect response times of under three minutes for verified members.
            </p>
          </div>
          
          {/* Signal beacon */}
          <div className="flex items-center space-x-2 bg-neutral-950 border border-white/5 py-2 px-4 rounded-xl self-start md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-550 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-550"></span>
            </span>
            <span className="font-mono text-[10px] text-gray-300 uppercase tracking-wider font-bold">
              Secure Channel Active
            </span>
          </div>
        </div>

        {/* Outer Split Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Elite Officer Profile Card (Karan Thakur) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Officer Card */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-gold-550/20 p-8 shadow-2xl flex flex-col text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-550/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-550 to-gold-750 flex items-center justify-center border border-white/10 shadow-lg font-display text-2xl font-black text-black">
                    KT
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-neutral-950 items-center justify-center" title="Online now">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-[#d4a331] uppercase bg-[#d4a331]/10 px-2 py-0.5 rounded border border-gold-550/10 font-bold">
                      Club President
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-gold-550" />
                  </div>
                  <h3 className="text-xl font-bold font-sans text-white mt-1">
                    Karan Thakur
                  </h3>
                  <p className="text-xs text-gray-400">Head of Global Operations</p>
                </div>
              </div>

              <div className="h-[1px] bg-white/5 w-full mb-6"></div>

              {/* Direct Access Coordinates */}
              <div className="space-y-4">
                
                {/* Contact Email Block */}
                <div className="group flex items-start gap-4 p-3.5 rounded-2xl bg-black border border-white/5 hover:border-gold-550/20 transition-all duration-300">
                  <div className="p-2.5 bg-neutral-905 rounded-xl text-gold-550 transition-colors group-hover:bg-gold-550/15">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                      Direct Email
                    </span>
                    <a 
                      href="mailto:karanthakur52216@gmail.com" 
                      className="text-sm font-semibold text-white group-hover:text-gold-550 transition-colors mt-0.5"
                    >
                      karanthakur52216@gmail.com
                    </a>
                  </div>
                </div>

                {/* Contact Phone Block */}
                <div className="group flex items-start gap-4 p-3.5 rounded-2xl bg-black border border-white/5 hover:border-gold-550/20 transition-all duration-300">
                  <div className="p-2.5 bg-neutral-905 rounded-xl text-gold-550 transition-colors group-hover:bg-gold-550/15">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                      Secure Phone Line
                    </span>
                    <a 
                      href="tel:+918544783904" 
                      className="text-sm font-semibold text-white group-hover:text-gold-550 transition-colors mt-0.5 font-mono"
                    >
                      +91 85447 83904
                    </a>
                  </div>
                </div>

                {/* Location Reference */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-black/40 border border-transparent">
                  <div className="p-2.5 bg-neutral-905 rounded-xl text-gray-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                      Global Headquarters
                    </span>
                    <span className="text-xs text-gray-300 mt-0.5">
                      Monaco Paddock & Dubai Marina Vaults
                    </span>
                  </div>
                </div>

              </div>

              {/* Verified Credentials badge */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verified Officer Profile
                </span>
                <span className="font-mono text-[10px] text-gray-600">ID: KT-91-8544</span>
              </div>

            </div>

            {/* Quick concierge options */}
            <div className="bg-neutral-950 rounded-2xl border border-white/5 p-6 text-left">
              <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3 font-semibold">
                Quick Dispatch Topics
              </h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleQuickInquiry("Nürburgring Membership Inquiry")}
                  className="w-full text-left p-2.5 rounded-xl bg-black border border-white/5 text-xs text-gray-300 hover:text-gold-550 hover:border-gold-550/20 transition-all font-medium"
                >
                  🏎️ Tour/Nürburgring Ring Passes
                </button>
                <button 
                  onClick={() => handleQuickInquiry("Supercar Yacht Charter Sync")}
                  className="w-full text-left p-2.5 rounded-xl bg-black border border-white/5 text-xs text-gray-300 hover:text-gold-550 hover:border-gold-550/20 transition-all font-medium"
                >
                  🚢 Superyacht Loading Logistics
                </button>
                <button 
                  onClick={() => handleQuickInquiry("Exclusive Off-Market Acquisition")}
                  className="w-full text-left p-2.5 rounded-xl bg-black border border-white/5 text-xs text-gray-300 hover:text-gold-550 hover:border-gold-550/20 transition-all font-medium"
                >
                  💎 Custom Off-Market Sourcing
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: High Performance Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/5 relative text-left">
              
              <div className="flex items-center space-x-2 text-left mb-6">
                <Clock className="w-4 h-4 text-gold-550" />
                <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-gray-300">
                  Priority Access Dispatch System
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Two columns: Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Lewis Hamilton"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                      Direct Contact Line
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2831"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email (Full width) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Secure Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      required
                      type="email"
                      placeholder="driver@vitesse.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Option */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Inquiry Topic
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors"
                  />
                </div>

                {/* Message (Textarea) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">
                    Detailed Message Brief
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details regarding preferred delivery locations, tailored configurations, or racetrack booking windows..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-gold-550 transition-colors resize-none"
                  />
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold tracking-wider text-xs transition-all cursor-pointer bg-gold-550 text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking Encryption...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Encrypted Inquiry</span>
                    </>
                  )}
                </button>

              </form>

              {/* Status messages */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-neutral-950/95 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
                      <CheckCircle className="w-8 h-8 text-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-lg font-bold text-white">Transmission Successful</h3>
                      <p className="text-xs text-gray-400">
                        Your message has been dispatched over secure lines. Karan Thakur or an officer will contact you shortly at your verified endpoints.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
