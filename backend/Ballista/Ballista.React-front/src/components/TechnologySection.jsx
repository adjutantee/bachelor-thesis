import React from 'react';
import { motion } from 'framer-motion';

export default function TechnologySection() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Powered by Modern Technology</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Использование алгоритмов и обработка данных в режиме реального времени обеспечивают точные
            расчеты и анализ для оптимального сбора информации.
          </p>
        </motion.div>
      </div>
    </section>
  );
}