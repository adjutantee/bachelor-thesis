import React from 'react';
import { motion } from 'framer-motion';
import { FaTelegram } from 'react-icons/fa';
import { TELEGRAM_CHANNEL_URL } from '../utils/constants';
import { fadeInUp } from '../utils/animations.jsx';

export default function TelegramSection() {
  return (
    <section className="bg-primary-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="flex flex-col items-center"
        >
          <FaTelegram className="w-16 h-16 text-primary-600 mb-6" />
          <h2 className="text-3xl font-bold mb-6">Следите за нами в Telegram</h2>
          <p className="text-gray-600 mb-8">
            Присоединяйтесь к нашему Telegram каналу для получения последних новостей
          </p>
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaTelegram className="mr-2" />
            Присоединиться к каналу
          </a>
        </motion.div>
      </div>
    </section>
  );
}