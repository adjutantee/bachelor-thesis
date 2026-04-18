import React from 'react';
import { GiTargetPoster } from 'react-icons/gi';
import { FaUserCircle } from 'react-icons/fa';

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GiTargetPoster className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Ballista</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaUserCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}