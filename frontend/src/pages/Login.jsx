import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    remember: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({
        loginEmail: formData.loginEmail,
        loginPassword: formData.loginPassword
      });

      if (result.success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          // Redirect to the page they were trying to access, or home page
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 100);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Ballista</h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Войти в аккаунт</h2>
          <p className="mt-2 text-sm text-gray-600">
            Или{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              создать новый аккаунт
            </Link>
          </p>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError('')} 
            className="mb-6" 
          />
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
              Электронная почта
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="loginEmail"
                name="loginEmail"
                type="email"
                autoComplete="email"
                required
                value={formData.loginEmail}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Введите email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="loginPassword"
                name="loginPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.loginPassword}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Введите пароль"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleInputChange}
                disabled={loading}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Запомнить меня
              </label>
            </div>

            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Забыли пароль?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}