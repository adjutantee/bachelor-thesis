import React from 'react';
import { FaEdit } from 'react-icons/fa';

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-[70vh]">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4">
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold">Иван Петров</h2>
        <p className="text-gray-500 text-sm mb-4">ID: 12345</p>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors mb-6">
          <FaEdit />
          <span>Редактировать профиль</span>
        </button>

        <div className="w-full border-t border-gray-200 my-4" />
        
        <div className="w-full">
          <h3 className="font-medium text-gray-900 mb-2">Общая статистика</h3>
          <div className="w-full border-t border-gray-200 my-4" />
          <h3 className="font-medium text-gray-900">Друзья</h3>
        </div>
      </div>
    </div>
  );
}