import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { statsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock recent scores data for the chart (since we don't have this endpoint yet)
  const mockRecentScores = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
    score: 85 + Math.random() * 10
  })).reverse();

  // Mock skill stats for radar chart
  const mockSkillStats = [
    { skill: 'Точность', value: 90 },
    { skill: 'Скорость', value: 85 },
    { skill: 'Стабильность', value: 88 },
    { skill: 'Концентрация', value: 92 },
    { skill: 'Техника', value: 87 }
  ];

  // Mock friends data
  const mockFriends = [
    { id: 1, name: 'Сергей Иванов', level: 'Эксперт', status: 'online' },
    { id: 2, name: 'Михаил Петров', level: 'Профессионал', status: 'offline' },
    { id: 3, name: 'Елена Смирнова', level: 'Эксперт', status: 'online' },
    { id: 4, name: 'Александр Козлов', level: 'Профессионал', status: 'offline' }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Profile: Loading stats from API');
      const response = await statsApi.getStats();
      console.log('Profile: Stats loaded successfully:', response.data);
      
      setStats(response.data);
    } catch (err) {
      console.error('Profile: Failed to load stats:', err);
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    const first = firstName ? firstName[0] : '';
    const last = lastName ? lastName[0] : '';
    return (first + last).toUpperCase();
  };

  const getFullName = (firstName, lastName) => {
    if (!firstName && !lastName) return 'Пользователь';
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} className="mb-6" />
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-700">
            {getInitials(user?.firstName, user?.lastName)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getFullName(user?.firstName, user?.lastName)}
              </h1>
              <p className="text-gray-500">{user?.email}</p>
              {user?.registrationDate && (
                <p className="text-sm text-gray-400">
                  Зарегистрирован: {format(new Date(user.registrationDate), 'PP', { locale: ru })}
                </p>
              )}
              {user?.lastLoginDate && (
                <p className="text-sm text-gray-400">
                  Последний вход: {format(new Date(user.lastLoginDate), 'PPp', { locale: ru })}
                </p>
              )}
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Редактировать профиль
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{mockFriends.length}</span>
              <span className="text-sm text-gray-500">Друзья</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{stats?.totalSessions || 0}</span>
              <span className="text-sm text-gray-500">Тренировки</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">
                {stats?.bestScore ? stats.bestScore.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-gray-500">Лучший результат</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Stats */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Общая статистика</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-sm font-medium text-primary-600">Всего тренировок</p>
              <p className="text-2xl font-bold text-primary-800">{stats?.totalSessions || 0}</p>
            </div>
            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-sm font-medium text-primary-600">Всего выстрелов</p>
              <p className="text-2xl font-bold text-primary-800">{stats?.totalShots || 0}</p>
            </div>
            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-sm font-medium text-primary-600">Средняя точность</p>
              <p className="text-2xl font-bold text-primary-800">
                {stats?.averageAccuracy ? stats.averageAccuracy.toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-sm font-medium text-primary-600">Лучший результат</p>
              <p className="text-2xl font-bold text-primary-800">
                {stats?.bestScore ? stats.bestScore.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Друзья</h2>
            <button className="text-primary-600 hover:text-primary-700">Показать все</button>
          </div>
          <div className="space-y-4">
            {mockFriends.map(friend => (
              <div key={friend.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.level}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Последние результаты</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRecentScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={[60, 100]} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Анализ навыков</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={mockSkillStats}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Навыки"
                  dataKey="value"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Discipline and Weapon Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Discipline Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Статистика по дисциплинам</h2>
          <div className="space-y-4">
            {stats?.disciplineStats && stats.disciplineStats.length > 0 ? (
              stats.disciplineStats.map((discipline, index) => (
                <div key={discipline.disciplineId || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{discipline.name}</p>
                    <p className="text-xs text-gray-500">Тренировок: {discipline.sessionsCount}</p>
                  </div>
                  <span className="ml-2 px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-full">
                    {discipline.averageScore.toFixed(1)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет данных по дисциплинам
              </div>
            )}
          </div>
        </div>

        {/* Weapon Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Статистика по оружию</h2>
          <div className="space-y-4">
            {stats?.weaponStats && stats.weaponStats.length > 0 ? (
              stats.weaponStats.map((weapon, index) => (
                <div key={weapon.weaponTypeId || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{weapon.name}</p>
                    <p className="text-xs text-gray-500">Тренировок: {weapon.sessionsCount}</p>
                  </div>
                  <span className="ml-2 px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-full">
                    {weapon.averageScore.toFixed(1)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет данных по оружию
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}