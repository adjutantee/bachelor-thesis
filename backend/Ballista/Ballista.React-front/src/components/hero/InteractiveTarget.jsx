import React from 'react';
import { motion } from 'framer-motion';

export default function InteractiveTarget() {
  return (
    <div className="relative w-full h-[600px]">
      {/* Main target circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 border-2 border-primary-400/30 rounded-full"
          style={{
            width: `${(5-i) * 100}px`,
            height: `${(5-i) * 100}px`,
            marginLeft: `-${((5-i) * 100) / 2}px`,
            marginTop: `-${((5-i) * 100) / 2}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}

      {/* Floating elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-3 h-3 bg-primary-400/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Center crosshair */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-20 h-20 -ml-10 -mt-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary-400">
          <motion.path
            d="M50 10v80M10 50h80M50 50m-30 0a30 30 0 1 1 60 0a30 30 0 1 1 -60 0"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Data points */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`data-${i}`}
          className="absolute bg-primary-400/20 backdrop-blur-sm rounded-lg p-3 text-sm text-primary-200"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {`${Math.floor(Math.random() * 100)}%`}
        </motion.div>
      ))}
    </div>
  );
}