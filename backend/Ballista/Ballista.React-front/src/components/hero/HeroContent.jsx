import React from 'react';
import { motion } from 'framer-motion';
import { GiTargetPoster } from 'react-icons/gi';
import { scrollToSection } from '../../utils/scroll';
import InteractiveTarget from './InteractiveTarget';

export default function HeroContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left side - Text content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-left relative z-10"
      >
        <motion.div 
          className="flex items-center gap-3 mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <GiTargetPoster className="w-12 h-12 text-primary-400" />
          <span className="text-2xl font-bold text-primary-300">Ballista</span>
        </motion.div>

        <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-300 to-white leading-tight">
          Точность.<br />
          Анализ.<br />
          Результат.
        </h1>

        <p className="text-xl text-primary-100 mb-12 max-w-xl">
          Продвинутая платформа для анализа и улучшения результатов стрельбы,
          созданная профессионалами для профессионалов.
        </p>

        <motion.button
          onClick={() => scrollToSection('features')}
          className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold relative overflow-hidden group shadow-lg shadow-primary-500/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Начать работу</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>

      {/* Right side - Interactive element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative hidden lg:block"
      >
        <InteractiveTarget />
      </motion.div>
    </div>
  );
}