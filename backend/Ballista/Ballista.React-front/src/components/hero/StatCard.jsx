import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="relative bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-primary-400/50 transition-all duration-300 group"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-500/5 to-primary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-8 h-8 mb-3 text-primary-300" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>
        <div className="text-sm text-primary-200">{label}</div>
      </div>
    </motion.div>
  );
}