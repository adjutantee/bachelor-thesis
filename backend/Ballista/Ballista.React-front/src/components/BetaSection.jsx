import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp } from '../utils/animations';
import { GiCrosshair } from 'react-icons/gi';

export default function BetaSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-gray-900/95 to-primary-900/90 backdrop-blur-xl" />
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="max-w-3xl mx-auto"
        >
          {/* Card with glass effect */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/10 shadow-2xl">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 mx-auto mb-8 bg-primary-600/20 rounded-full flex items-center justify-center"
            >
              <GiCrosshair className="w-10 h-10 text-primary-400" />
            </motion.div>

            {/* Title with gradient */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary-300 via-white to-primary-300 bg-clip-text text-transparent"
            >
              Закрытый бета тест
            </motion.h2>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-primary-100 text-center mb-10"
            >
              Вход для участников бета тестирования
            </motion.p>

            {/* Button with enhanced hover effect */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <button
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                {/* Button content */}
                <span className="relative z-10 text-white font-semibold text-lg flex items-center gap-2">
                  Войти
                  <GiCrosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}