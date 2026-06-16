import React from 'react';
import { Compass, ShieldCheck, Heart, Users, Milestone, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutTab: React.FC = () => {
  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white" id="about-tab-root">
      <div className="max-w-4xl mx-auto">
        {/* Banner with logo */}
        <div className="text-center mb-16">
          <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-4 block uppercase leading-relaxed">
            ESTABLISHED IN MONACO • 2012
          </span>
          <h1 className="text-4xl md:text-7xl font-display font-light font-bold tracking-tight mb-4">
            Engineering <span className="font-display italic text-gradient bg-clip-text bg-gradient-to-r from-gold-550 to-gold-600">Purity</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold-550 mx-auto mt-6"></div>
        </div>

        {/* Brand story section */}
        <section className="bg-neutral-950 p-8 md:p-12 rounded-3xl border border-white/5 space-y-6 text-left mb-12">
          <h2 className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-gold-550" />
            The Velocity Pedigree
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Velocity was founded with a singular conviction: that driving is not a means of displacement, but a profound medium of biological exhilaration. We exist exclusively to curate key access to the world’s most supreme hand-engineered mechanical triumphs.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Whether you are piloting a twin-turbocharged flat-six Porsche 911 GT3 RS through the alpine curves of Switzerland, or testing the absolute hybrid boundaries of a Ferrari SF90 Stradale along Monaco's Casino Square, our localized support crews operate in 19 world coordinates to guarantee perfection.
          </p>
        </section>

        {/* Grid points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5">
            <ShieldCheck className="w-8 h-8 text-gold-550 mb-4" />
            <h3 className="font-bold text-base mb-2">Zero-Tolerance Prep</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every supercar is detailed under high-output LED arrays, checked with electronic thickness parameters, and aligned by professional formula mechanics before release.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5">
            <Award className="w-8 h-8 text-gold-550 mb-4" />
            <h3 className="font-bold text-base mb-2">Private Track Licensing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We leverage active affiliations with leading European, Mid-East, and US track circuits to coordinate guest licensing and custom paddock VIP entries.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5">
            <Users className="w-8 h-8 text-gold-550 mb-4" />
            <h3 className="font-bold text-base mb-2">Local Yacht Dispatch</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our support vehicles are custom-equipped with flatbed lifts designed specifically to load or extract exotic sport models onto chartered superyachts safely.
            </p>
          </div>
        </div>

        {/* Vintage citation footer */}
        <div className="text-center py-6 text-xs font-mono text-gray-500">
          <p>"To drive is to live. All else is merely waiting."</p>
        </div>
      </div>
    </div>
  );
};
