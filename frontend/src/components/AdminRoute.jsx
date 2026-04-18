import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  console.log('AdminRoute Debug: Current state:', {
    isAuthenticated,
    isAdmin,
    loading,
    userRoles: user?.roles,
    user: user ? { name: user.name, email: user.email, isAdmin: user.isAdmin } : null
  });

  if (loading) {
    console.log('AdminRoute Debug: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminRoute Debug: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log('AdminRoute Debug: User is not admin, showing access denied');
    console.log('AdminRoute Debug: User details:', user);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-2">
            У вас нет прав администратора для доступа к этой странице.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p>Текущие роли: {user?.roles?.join(', ') || 'Нет ролей'}</p>
            <p>Статус админа: {isAdmin ? 'Да' : 'Нет'}</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  console.log('AdminRoute Debug: Access granted, rendering admin panel');
  return children;
};

export default AdminRoute;