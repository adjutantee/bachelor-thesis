import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { FiTrendingUp, FiTarget, FiAward, FiActivity } from 'react-icons/fi';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Disciplines from './pages/Disciplines';
import WeaponTypes from './pages/WeaponTypes';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { statsApi, shootingSessionApi } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function Dashboard() {
  const [dateRange, setDateRange] = useState('7');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for the weekly chart (since we don't have this endpoint yet)
  const mockWeeklyStats = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
    accuracy: 85 + Math.random() * 10,
  })).reverse();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Dashboard: Loading data from API');
      
      // Load stats
      const statsResponse = await statsApi.getStats().catch(err => {
        console.error('Dashboard: Failed to load stats:', err);
        return { data: null };
      });

      console.log('Dashboard: Stats loaded:', statsResponse.data);
      
      setStats(statsResponse.data);
      
    } catch (err) {
      console.error('Dashboard: Failed to load dashboard data:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 animate-pulse">Загружаем ваши данные...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <ErrorMessage message={error} className="mb-6" />
              <button
                onClick={loadDashboardData}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats?.averageAccuracy ? stats.averageAccuracy.toFixed(1) : '0.0'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mt-4">Средняя точность</h3>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <FiAward className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats?.bestScore ? stats.bestScore.toFixed(1) : '0.0'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mt-4">Лучший результат</h3>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <FiActivity className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats?.totalSessions || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mt-4">Тренировки</h3>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <FiTarget className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats?.totalShots || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mt-4">Выстрелы</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Аналитика результатов</h2>
                  <p className="text-gray-600">Отслеживайте свой прогресс во времени</p>
                </div>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="rounded-xl border-0 bg-white px-4 py-2 text-gray-700 shadow-md focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                >
                  <option value="7">Последние 7 дней</option>
                  <option value="30">Последние 30 дней</option>
                  <option value="90">Последние 90 дней</option>
                </select>
              </div>
            </div>
            <div className="p-8">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockWeeklyStats}>
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[60, 100]} 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#374151', fontWeight: '600' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#0ea5e9" 
                      strokeWidth={4}
                      fill="url(#colorAccuracy)"
                      dot={{ fill: '#0ea5e9', strokeWidth: 3, r: 6, stroke: '#ffffff' }}
                      activeDot={{ r: 8, fill: '#0ea5e9', stroke: '#ffffff', strokeWidth: 3 }}
                      filter="drop-shadow(0 4px 6px rgb(14 165 233 / 0.3))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            {/* Top Disciplines */}
            {stats?.disciplineStats && stats.disciplineStats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Топ дисциплины</h3>
                  <p className="text-sm text-gray-600">Ваши лучшие результаты</p>
                </div>
                <div className="p-6 space-y-4">
                  {stats.disciplineStats.slice(0, 3).map((discipline, index) => (
                    <div key={discipline.disciplineId || index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          'bg-gradient-to-r from-orange-400 to-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                            {discipline.name}
                          </p>
                          <p className="text-xs text-gray-500">Сессии × {discipline.sessionsCount}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md">
                        {discipline.averageScore.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Weapons */}
            {stats?.weaponStats && stats.weaponStats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Топ оружие</h3>
                  <p className="text-sm text-gray-600">Лучшие показатели</p>
                </div>
                <div className="p-6 space-y-4">
                  {stats.weaponStats.slice(0, 3).map((weapon, index) => (
                    <div key={weapon.weaponTypeId || index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-emerald-50 hover:to-teal-50 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          'bg-gradient-to-r from-orange-400 to-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-900 transition-colors">
                            {weapon.name}
                          </p>
                          <p className="text-xs text-gray-500">Сессии × {weapon.sessionsCount}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-md">
                        {weapon.averageScore.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!stats?.disciplineStats || stats.disciplineStats.length === 0) && 
             (!stats?.weaponStats || stats.weaponStats.length === 0) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <FiTarget className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Начните тренировки</h3>
                  <p className="text-gray-500 text-sm mb-4">Создайте первую тренировку, чтобы увидеть статистику</p>
                  <button 
                    onClick={() => window.location.href = '/sessions'}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Создать тренировку
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Header />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/disciplines" element={<Disciplines />} />
                  <Route path="/weapons" element={<WeaponTypes />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/sessions/:id" element={<SessionDetail />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } 
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;