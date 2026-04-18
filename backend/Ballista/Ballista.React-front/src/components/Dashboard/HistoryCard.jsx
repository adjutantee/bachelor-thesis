import React from 'react';
import { motion } from 'framer-motion';

export default function HistoryCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-[265px]">
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex-1 p-4 bg-primary-50 rounded-lg text-primary-600 font-medium hover:bg-primary-100 transition-colors"
        >
          Статистика
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex-1 p-4 bg-primary-50 rounded-lg text-primary-600 font-medium hover:bg-primary-100 transition-colors"
        >
          История результатов
        </motion.button>
      </div>
    </div>
  );
}