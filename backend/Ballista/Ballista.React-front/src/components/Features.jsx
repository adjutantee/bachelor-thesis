import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { featuresList } from '../data/features.jsx';

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Особенности платформы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Инструменты и функции, разработанные для улучшения качества
          и повышения эффективности за счет расширенной аналитики.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}