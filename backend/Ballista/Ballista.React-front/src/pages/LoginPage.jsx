import React from 'react';
import Login from '../components/Login';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Авторизация
          </h2>
          <p className="text-gray-600">
            Войдите в свой аккаунт для доступа к бета-тестированию
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
}