import React from 'react';
import { motion } from 'framer-motion';

export const CirclePattern = () => (
  <svg width="400" height="400" viewBox="0 0 400 400" className="absolute opacity-50">
    <motion.circle
      cx="200" cy="200" r="150"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.circle
      cx="200" cy="200" r="100"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
    />
  </svg>
);

export const CrosshairPattern = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="absolute opacity-30">
    <motion.path
      d="M100 20v160M20 100h160M100 100m-60 0a60 60 0 1 1 120 0a60 60 0 1 1 -120 0"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </svg>
);

export const WavePattern = () => (
  <motion.div
    className="absolute inset-0 opacity-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1 }}
    transition={{ duration: 1 }}
  >
    <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="none">
      <motion.path
        d="M0,100 C300,300 900,-100 1200,100 L1200,400 L0,400 Z"
        fill="currentColor"
        initial={{ y: 100 }}
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </motion.div>
);