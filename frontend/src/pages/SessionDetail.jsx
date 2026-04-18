import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiArrowLeft, FiTarget, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { shootingSessionApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import InteractiveTarget from '../components/InteractiveTarget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('SessionDetail: Loading session with ID:', id);
      const response = await shootingSessionApi.getById(id);
      console.log('SessionDetail: Loaded session:', response.data);
      
      setSession(response.data);
    } catch (err) {
      console.error('SessionDetail: Failed to load session:', err);
      setError(err.message || 'Ошибка загрузки тренировки');
    } finally {
      setLoading(false);
    }
  };

  // Format training duration for display - Updated to handle string format
  const formatTrainingDuration = (trainingDuration) => {
    console.log('SessionDetail: Formatting training duration:', trainingDuration, 'Type:', typeof trainingDuration);
    
    if (!trainingDuration) {
      return 'Не указано';
    }
    
    // Handle string format (HH:MM:SS)
    if (typeof trainingDuration === 'string') {
      const parts = trainingDuration.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        
        if (hours > 0) {
          return `${hours}ч ${minutes}м ${seconds}с`;
        } else if (minutes > 0) {
          return `${minutes}м ${seconds}с`;
        } else {
          return `${seconds}с`;
        }
      }
      return trainingDuration; // Return as-is if format is unexpected
    }
    
    // Handle object format with ticks (legacy support)
    if (typeof trainingDuration === 'object' && trainingDuration.ticks) {
      // Convert ticks to seconds (1 second = 10,000,000 ticks)
      const seconds = Math.floor(trainingDuration.ticks / 10000000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (minutes > 0) {
        return `${minutes}м ${remainingSeconds}с`;
      } else {
        return `${remainingSeconds}с`;
      }
    }
    
    return 'Не указано';
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/sessions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft className="mr-2" />
              Назад к тренировкам
            </Link>
          </div>
          <LoadingSpinner size="lg" className="py-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/sessions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft className="mr-2" />
              Назад к тренировкам
            </Link>
          </div>
          <ErrorMessage message={error} className="mb-6" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/sessions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft className="mr-2" />
              Назад к тренировкам
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Тренировка не найдена</h2>
            <p className="text-gray-600 mt-2">Тренировка с указанным ID не существует.</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for charts - handle both series-based and flat shots structure
  let allShots = [];
  
  if (session.series && session.series.length > 0) {
    // If session has series structure
    allShots = session.series.flatMap(series => 
      series.shots?.map((shot, index) => ({
        ...shot,
        globalIndex: index + 1
      })) || []
    );
  } else if (session.shots && session.shots.length > 0) {
    // If session has flat shots structure (from your DTO)
    allShots = session.shots.map((shot, index) => ({
      ...shot,
      shotNumber: index + 1,
      globalIndex: index + 1
    }));
  }

  const scoreData = {
    labels: allShots.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: 'Очки',
        data: allShots.map(shot => shot.score),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const totalScore = session.totalScore || allShots.reduce((sum, shot) => sum + shot.score, 0);
  const averageScore = allShots.length > 0 ? totalScore / allShots.length : 0;
  const bestShot = allShots.length > 0 ? Math.max(...allShots.map(s => s.score)) : 0;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/sessions"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Назад к тренировкам
          </Link>
        </div>

        {/* Header with key stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Детали тренировки
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>
                  📅 {session.date ? format(new Date(session.date), 'PP', { locale: ru }) : 'Не указана'}
                </span>
                <span>🎯 {session.discipline || 'Неизвестная дисциплина'}</span>
                <span>🔫 {session.weaponType || 'Неизвестное оружие'}</span>
                {session.trainingDuration && (
                  <span className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    {formatTrainingDuration(session.trainingDuration)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center bg-blue-50 rounded-xl p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600">{totalScore.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Общий счет</div>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Средний</div>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-purple-600">{bestShot.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Лучший</div>
              </div>
              <div className="text-center bg-orange-50 rounded-xl p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-orange-600">{allShots.length}</div>
                <div className="text-xs text-gray-600">Выстрелов</div>
              </div>
              {session.trainingDuration && (
                <div className="text-center bg-indigo-50 rounded-xl p-4 min-w-[100px]">
                  <div className="text-lg font-bold text-indigo-600">
                    {formatTrainingDuration(session.trainingDuration)}
                  </div>
                  <div className="text-xs text-gray-600">Время</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Visualization using InteractiveTarget component */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiTarget className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Мишень</h2>
            </div>
            
            {allShots.length > 0 ? (
              <InteractiveTarget
                shots={allShots}
                disabled={true}
                className="max-w-md mx-auto"
              />
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500 bg-gray-50 rounded-xl">
                Нет данных о выстрелах
              </div>
            )}
          </div>

          {/* Score Progression Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiTrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Прогресс результатов</h2>
            </div>
            
            {allShots.length > 0 ? (
              <div className="h-80">
                <Line
                  data={scoreData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Номер выстрела'
                        }
                      },
                      y: {
                        min: Math.max(0, Math.floor(Math.min(...allShots.map(s => s.score)) - 1)),
                        max: 11,
                        title: {
                          display: true,
                          text: 'Очки'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                Нет данных для отображения
              </div>
            )}
          </div>
        </div>

        {/* Training Duration Details - SIMPLIFIED: Only show session time */}
        {session.trainingDuration && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex items-center mb-4">
              <FiClock className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Время тренировки</h2>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {formatTrainingDuration(session.trainingDuration)}
                </div>
                <div className="text-sm text-gray-600">Время тренировки</div>
              </div>
            </div>
          </div>
        )}

        {/* Series Details - Only show if session has series structure */}
        {session.series && session.series.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex items-center mb-6">
              <FiAward className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Детали по сериям</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.series.map((series, index) => {
                const seriesScore = series.shots?.reduce((sum, shot) => sum + shot.score, 0) || 0;
                const seriesAverage = series.shots?.length > 0 ? seriesScore / series.shots.length : 0;
                
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Серия {series.seriesNumber || index + 1}
                      </h3>
                      <span className="text-xl font-bold text-primary-600">{seriesScore.toFixed(1)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Средний:</span>
                        <span className="font-medium">{seriesAverage.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Выстрелов:</span>
                        <span className="font-medium">{series.shots?.length || 0}</span>
                      </div>
                    </div>
                    
                    {/* Individual shots in series */}
                    {series.shots && series.shots.length > 0 && (
                      <div className="grid grid-cols-5 gap-1">
                        {series.shots.map((shot, shotIndex) => (
                          <div
                            key={shotIndex}
                            className="text-xs text-center p-1 bg-white rounded border font-medium"
                            title={`Выстрел ${shot.shotNumber || shotIndex + 1}: ${shot.score.toFixed(1)}`}
                          >
                            {shot.score.toFixed(1)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Individual Shots Table - Show for flat shots structure, but hide coordinates */}
        {!session.series && allShots.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Детали выстрелов</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Выстрел</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Очки</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Качество</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allShots.map((shot, index) => {
                    // Determine shot quality based on score
                    const getQuality = (score) => {
                      if (score >= 10) return { text: 'Отлично', color: 'bg-green-100 text-green-800' };
                      if (score >= 9) return { text: 'Хорошо', color: 'bg-blue-100 text-blue-800' };
                      if (score >= 7) return { text: 'Удовлетворительно', color: 'bg-yellow-100 text-yellow-800' };
                      if (score >= 5) return { text: 'Слабо', color: 'bg-orange-100 text-orange-800' };
                      return { text: 'Промах', color: 'bg-red-100 text-red-800' };
                    };
                    
                    const quality = getQuality(shot.score);
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                            {shot.score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${quality.color}`}>
                            {quality.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {session.notes && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Заметки</h2>
            <p className="text-gray-700 leading-relaxed">{session.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}