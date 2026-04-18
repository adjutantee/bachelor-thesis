import React from 'react';
import { motion } from 'framer-motion';
import HeroContent from './hero/HeroContent';
import BackgroundEffects from './hero/BackgroundEffects';

export default function Hero() {
  return (
    <header className="relative min-h-screen overflow-hidden">
      <BackgroundEffects />
      
      {/* Content */}
      <div className="container mx-auto px-6 relative">
        <div className="pt-32 pb-24">
          <HeroContent />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </header>
  );
}