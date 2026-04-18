import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    registerUserName: '',
    registerEmail: '',
    registerFirstName: '',
    registerLastName: '',
    registerPassword: '',
    registerReTypePassword: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.registerPassword !== formData.registerReTypePassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    if (formData.registerPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Необходимо согласиться с условиями использования');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        registerUserName: formData.registerUserName,
        registerEmail: formData.registerEmail,
        registerFirstName: formData.registerFirstName,
        registerLastName: formData.registerLastName,
        registerPassword: formData.registerPassword,
        registerReTypePassword: formData.registerReTypePassword
      });

      if (result.success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          // Redirect to home page after successful registration
          navigate('/', { replace: true });
        }, 100);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Ballista</h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Создать аккаунт</h2>
          <p className="mt-2 text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Войти
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
            <label htmlFor="registerUserName" className="block text-sm font-medium text-gray-700">
              Имя пользователя
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="registerUserName"
                name="registerUserName"
                type="text"
                autoComplete="username"
                required
                value={formData.registerUserName}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Введите имя пользователя"
              />
            </div>
          </div>

          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">
              Электронная почта
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="registerEmail"
                name="registerEmail"
                type="email"
                autoComplete="email"
                required
                value={formData.registerEmail}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="registerFirstName" className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <div className="mt-1">
                <input
                  id="registerFirstName"
                  name="registerFirstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.registerFirstName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Имя"
                />
              </div>
            </div>

            <div>
              <label htmlFor="registerLastName" className="block text-sm font-medium text-gray-700">
                Фамилия
              </label>
              <div className="mt-1">
                <input
                  id="registerLastName"
                  name="registerLastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.registerLastName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Фамилия"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="registerPassword"
                name="registerPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.registerPassword}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Создайте пароль"
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

          <div>
            <label htmlFor="registerReTypePassword" className="block text-sm font-medium text-gray-700">
              Подтверждение пароля
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="registerReTypePassword"
                name="registerReTypePassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.registerReTypePassword}
                onChange={handleInputChange}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Подтвердите пароль"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              disabled={loading}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1 disabled:cursor-not-allowed"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              Я согласен с{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                Условиями использования
              </Link>{' '}
              и{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                Политикой конфиденциальности
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
}