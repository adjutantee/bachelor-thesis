import React from 'react';
import { motion } from 'framer-motion';

export const FloatingCrosshair = () => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className="absolute"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.5, scale: 1 }}
    transition={{ duration: 1 }}
  >
    <motion.circle
      cx="30"
      cy="30"
      r="25"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2 }}
    />
    <motion.path
      d="M30 15v30M15 30h30"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    />
  </motion.svg>
);

export const FloatingDots = () => (
  <div className="absolute inset-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export const GradientOrbs = () => (
  <>
    <motion.div
      className="absolute top-20 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div
      className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        rotate: [90, 0, 90],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </>
);