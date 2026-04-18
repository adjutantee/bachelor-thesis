import React from 'react';
import { FaChartLine, FaDatabase, FaHistory, FaThermometerHalf, FaTools } from 'react-icons/fa';
import { GiTargetPoster } from 'react-icons/gi';

export const featuresList = [
  {
    icon: <FaChartLine className="w-6 h-6" />,
    title: 'Сбор информации',
    description: 'Платформа позволит вам ввести удобный для себя учет результатов ваших достижений',
  },
  {
    icon: <FaDatabase className="w-6 h-6" />,
    title: 'Обширная база',
    description: 'Большая разновидность оружия а также типов патронов, которые регулярно пополняются',
  },
  {
    icon: <GiTargetPoster className="w-6 h-6" />,
    title: 'Отслеживание производительности',
    description: 'Удобная визуализация ваших результатов',
  },
  {
    icon: <FaHistory className="w-6 h-6" />,
    title: 'Отслеживание истории',
    description: 'Полные данные о ваших сессиях будут сохранены',
  },
  {
    icon: <FaThermometerHalf className="w-6 h-6" />,
    title: 'Мониторинг окружающей среды',
    description: 'Отслеживание состояния окружающей среды в режиме реального времени и рекомендации',
  },
  {
    icon: <FaTools className="w-6 h-6" />,
    title: 'Custom Load Development',
    description: 'Tools for developing and testing custom ammunition loads',
  },
];
