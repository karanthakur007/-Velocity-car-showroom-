import React, { useState } from 'react';
import { Gem, ShieldCheck, Sparkles, Trophy, Flame, UserCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const MembershipTab: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [joinedStatus, setJoinedStatus] = useState<string | null>(null);

  const tiers = [
    {
      id: 'silver',
      name: 'Silver Gear',
      price: '$2,500 / yr',
      vibe: 'Ideal for weekend high-performance touring enthusiasts.',
      badgeColor: 'border-slate-500/30 text-slate-400 bg-slate-900/10',
      icon: Trophy,
      bullet: 'Silver Shield',
      features: [
        'Complementary delivery at major regional airports',
        '2 full track days with race pacing mechanics',
        'In-state high-speed pace car convoy access',
        '10% direct discount across our luxury supercar fleet',
        '24/7 basic VIP telephone coordination desk'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Veloce Alliance',
      price: '$7,500 / yr',
      vibe: 'Created for global jet setters who demand high speed.',
      badgeColor: 'border-gold-550/30 text-gold-550 bg-gold-550/10',
      icon: Gem,
      bullet: 'Gold Shield',
      featured: true,
      features: [
        'Worldwide flatbed concierge helicopter yacht delivery',
        '5 ultimate private track day passes at Nürburgring',
        'Full damage and liability waiver policy with zero excess',
        '20% continuous discount across our exotic catalog',
        'Immediate on-demand personal concierge messenger',
        'Access to our private VIP regional rally events'
      ]
    },
    {
      id: 'black',
      name: 'Black Velvet Syndicate',
      price: '$15,000 / yr',
      vibe: 'Strictly limited. Private syndicate for ultimate track elite.',
      badgeColor: 'border-red-500/30 text-red-500 bg-red-950/20',
      icon: Flame,
      bullet: 'Black Shield',
      features: [
        'Unlimited global concierge shipment at any yacht harbor',
        'Infinite Nürburgring and Spa track track access',
        '30% absolute discount on all supercar hires',
        'Private chauffeur helicopter yacht shuttle included services',
        'A bottle of vintage Dom Pérignon in the car glovebox',
        'Personal mechanics and pit paddock hospitality suite'
      ]
    }
  ];

  const handleJoinTier = (tierName: string) => {
    setSelectedTier(tierName);
    setLoadingJoin(true);
    setTimeout(() => {
      setLoadingJoin(false);
      setJoinedStatus(tierName);
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white" id="membership-tab-root">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-3 block uppercase">
            THE PRIVATE SYNDICATE
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-4">
            Become a Velocity Member
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Unlock unprecedented access to the world’s most powerful driving leagues. Our tiers grant elite track benefits, personal host messengers, and first-choice delivery anywhere on Earth.
          </p>
        </div>

        {/* Status claimed Overlay */}
        {joinedStatus ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-950 border border-gold-550/30 p-10 rounded-3xl max-w-xl mx-auto text-center shadow-2xl relative overflow-hidden"
          >
            {/* Decorative glares */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-550/10 rounded-full blur-3xl pointer-events-none"></div>

            <CheckCircle2 className="w-16 h-16 text-gold-550 mx-auto mb-6 animate-bounce" />
            <span className="font-mono text-xs text-gold-550 tracking-widest uppercase block mb-1">
              AUTHENTICATION COMPLETED
            </span>
            <h2 className="text-2xl font-bold font-sans">
              Welcome to the {joinedStatus} Tier
            </h2>
            <p className="text-gray-400 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
              You are officially registered in our global paddock syndicate. Your custom metal RFID card is being engraved by hand and dispatched alongside your next booking slot.
            </p>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-4">
              <button 
                onClick={() => setJoinedStatus(null)}
                className="px-6 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs font-semibold hover:border-white/20 transition-all cursor-pointer"
              >
                View Tier Charts
              </button>
            </div>
          </motion.div>
        ) : (
          /* Show Membership Pricing Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2" id="membership-tiers-grid">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between bg-neutral-950 rounded-3xl p-8 border hover:scale-[1.01] transition-all duration-300 ${
                    tier.featured 
                      ? 'border-gold-550 shadow-[0_0_30px_rgba(226,182,83,0.08)] scale-[1.02]' 
                      : 'border-white/5'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-550 text-black text-[9px] font-mono tracking-[0.2em] font-extrabold uppercase px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR CAPTAIN SECURE
                    </span>
                  )}

                  <div>
                    {/* Header Details */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl border ${tier.badgeColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-bold font-mono tracking-tight text-white">
                        {tier.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold font-sans text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                      {tier.vibe}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-3.5 mb-8">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Submission triggers */}
                  <button
                    onClick={() => handleJoinTier(tier.name)}
                    disabled={loadingJoin}
                    className={`w-full py-3.5 text-xs font-semibold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      tier.featured 
                        ? 'bg-gold-550 text-black font-extrabold shadow-lg hover:bg-gold-600' 
                        : 'bg-neutral-900 text-white hover:bg-neutral-850 border border-white/5'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{loadingJoin ? 'Authenticating...' : `Select ${tier.name}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Global membership warning note */}
        <div className="mt-16 text-center text-xs text-gray-500 border-t border-white/5 pt-8 max-w-xl mx-auto">
          <p className="leading-relaxed">
            Membership dues are fully integrated with your Cloud SQL profile preferences. Daily allowances, complimentary airport delivery slots, and track track waivers will show up immediately on your booking receipts.
          </p>
        </div>

      </div>
    </div>
  );
};
