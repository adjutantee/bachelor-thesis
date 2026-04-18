import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiClock, FiPlay, FiPause, FiSquare, FiRotateCcw, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { disciplineApi, weaponTypeApi, exerciseTemplateApi, shootingSessionApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import InteractiveTarget from '../components/InteractiveTarget';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState('');
  const [selectedWeaponFilter, setSelectedWeaponFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('date'); // date, score, shots
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [currentSeries, setCurrentSeries] = useState(1);
  const [shots, setShots] = useState([]);
  const [seriesConfig, setSeriesConfig] = useState({ seriesCount: 3, shotsPerSeries: 3 });

  // Timer states
  const [timerMinutes, setTimerMinutes] = useState(75);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75 * 60); // 75 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null); // Track when session actually started
  const [sessionEndTime, setSessionEndTime] = useState(null); // Track when session ended

  useEffect(() => {
    loadData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            setSessionEndTime(Date.now()); // Mark session end time
            // Show notification when time is up
            if (Notification.permission === 'granted') {
              new Notification('Время вышло!', {
                body: 'Время тренировки истекло',
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Request notification permission when component mounts
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Sessions: Loading data from API');
      
      // Load disciplines
      const disciplinesRes = await disciplineApi.getAll();
      console.log('Sessions: Disciplines loaded:', disciplinesRes.data);
      setDisciplines(disciplinesRes.data || []);

      // Load weapons
      try {
        const weaponsRes = await weaponTypeApi.getAll();
        console.log('Sessions: Weapons loaded:', weaponsRes.data);
        setWeapons(weaponsRes.data || []);
      } catch (weaponError) {
        console.error('Sessions: Failed to load weapons:', weaponError);
        setWeapons([]);
      }

      // Load templates
      try {
        const templatesRes = await exerciseTemplateApi.getAll();
        console.log('Sessions: Templates loaded:', templatesRes.data);
        setTemplates(templatesRes.data || []);
      } catch (templateError) {
        console.error('Sessions: Failed to load templates:', templateError);
        setTemplates([]);
      }

      // Load sessions
      try {
        const sessionsRes = await shootingSessionApi.getAll();
        console.log('Sessions: Sessions loaded:', sessionsRes.data);
        setSessions(sessionsRes.data || []);
      } catch (sessionError) {
        console.error('Sessions: Failed to load sessions:', sessionError);
        setSessions([]);
      }

    } catch (err) {
      console.error('Sessions: Failed to load data:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      return;
    }

    try {
      await shootingSessionApi.delete(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError(err.message || 'Ошибка удаления тренировки');
    }
  };

  // Filter and sort functions
  const getFilteredAndSortedSessions = () => {
    let filtered = sessions.filter(session => {
      // Search filter
      const searchMatch = !searchTerm || 
        session.discipline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.weaponType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      // Discipline filter
      const disciplineMatch = !selectedDisciplineFilter || 
        session.discipline === selectedDisciplineFilter;

      // Weapon filter
      const weaponMatch = !selectedWeaponFilter || 
        session.weaponType === selectedWeaponFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter !== 'all' && session.date) {
        const sessionDate = new Date(session.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (dateFilter) {
          case 'today':
            dateMatch = sessionDate >= today;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = sessionDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateMatch = sessionDate >= monthAgo;
            break;
        }
      }

      return searchMatch && disciplineMatch && weaponMatch && dateMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || 0);
          bValue = new Date(b.date || 0);
          break;
        case 'score':
          aValue = a.totalScore || 0;
          bValue = b.totalScore || 0;
          break;
        case 'shots':
          aValue = a.shots?.length || 0;
          bValue = b.shots?.length || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        console.log('Sessions: Template selected:', template);
        setSeriesConfig({
          seriesCount: template.seriesCount || 3,
          shotsPerSeries: template.shotsPerSeries || 3
        });
        setSelectedDiscipline(template.disciplineId || '');
        
        // Reset shots when template changes
        setShots([]);
        setCurrentSeries(1);
      }
    } else {
      // Reset to default when no template selected
      setSeriesConfig({ seriesCount: 3, shotsPerSeries: 3 });
      setShots([]);
      setCurrentSeries(1);
    }
  };

  const handleShotAdded = (shot) => {
    console.log('Sessions: Shot added:', shot);
    setShots(prev => [...prev, shot]);
  };

  const handleSeriesNavigation = (direction) => {
    if (direction === 'next' && currentSeries < seriesConfig.seriesCount) {
      setCurrentSeries(prev => prev + 1);
    } else if (direction === 'prev' && currentSeries > 1) {
      setCurrentSeries(prev => prev - 1);
    }
  };

  const resetCurrentSeries = () => {
    const startIndex = (currentSeries - 1) * seriesConfig.shotsPerSeries;
    const endIndex = startIndex + seriesConfig.shotsPerSeries;
    setShots(prev => [
      ...prev.slice(0, startIndex),
      ...prev.slice(endIndex)
    ]);
  };

  const getCurrentSeriesShots = () => {
    const startIndex = (currentSeries - 1) * seriesConfig.shotsPerSeries;
    const endIndex = startIndex + seriesConfig.shotsPerSeries;
    return shots.slice(startIndex, endIndex);
  };

  const getSeriesScore = (seriesNumber) => {
    const startIndex = (seriesNumber - 1) * seriesConfig.shotsPerSeries;
    const endIndex = startIndex + seriesConfig.shotsPerSeries;
    const seriesShots = shots.slice(startIndex, endIndex);
    return seriesShots.reduce((sum, shot) => sum + shot.score, 0);
  };

  const getTotalScore = () => {
    return shots.reduce((sum, shot) => sum + shot.score, 0);
  };

  const canNavigateNext = () => {
    return currentSeries < seriesConfig.seriesCount;
  };

  const canNavigatePrev = () => {
    return currentSeries > 1;
  };

  const isSeriesComplete = (seriesNumber) => {
    const startIndex = (seriesNumber - 1) * seriesConfig.shotsPerSeries;
    const endIndex = startIndex + seriesConfig.shotsPerSeries;
    const seriesShots = shots.slice(startIndex, endIndex);
    return seriesShots.length >= seriesConfig.shotsPerSeries;
  };

  // Convert seconds to TimeSpan format that ASP.NET Core expects
  const formatTimeSpanForApi = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Format as HH:MM:SS for TimeSpan
    const timeSpanString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    console.log(`Sessions: Converting ${totalSeconds} seconds to TimeSpan format: ${timeSpanString}`);
    return timeSpanString;
  };

  const handleCreateSession = async () => {
    try {
      setSaving(true);
      setError('');

      if (!selectedDiscipline || !selectedWeapon) {
        setError('Пожалуйста, выберите дисциплину и оружие');
        return;
      }

      if (shots.length === 0) {
        setError('Добавьте хотя бы один выстрел');
        return;
      }

      // Calculate training duration
      let trainingDurationSeconds = 0;

      if (sessionStartTime) {
        // Use actual training time if timer was started
        const endTime = sessionEndTime || Date.now();
        trainingDurationSeconds = Math.floor((endTime - sessionStartTime) / 1000);
        console.log('Sessions: Using actual session time:', trainingDurationSeconds, 'seconds');
      } else {
        // Fallback: use the time that was consumed from the timer
        const totalSetTime = timerMinutes * 60 + timerSeconds;
        trainingDurationSeconds = Math.max(0, totalSetTime - timeLeft);
        console.log('Sessions: Using timer consumption time:', trainingDurationSeconds, 'seconds');
      }

      console.log('Sessions: Creating session with data:', {
        disciplineId: selectedDiscipline,
        weaponTypeId: selectedWeapon,
        exerciseTemplateId: selectedTemplate || null,
        shots: shots,
        trainingDurationSeconds: trainingDurationSeconds
      });

      const sessionData = {
        disciplineId: selectedDiscipline,
        weaponTypeId: selectedWeapon,
        exerciseTemplateId: selectedTemplate || null,
        shots: shots.map(shot => ({
          x: shot.x,
          y: shot.y,
          score: shot.score
        })),
        // Send TimeSpan as string in HH:MM:SS format
        trainingDuration: formatTimeSpanForApi(trainingDurationSeconds)
      };

      console.log('Sessions: Final API payload:', JSON.stringify(sessionData, null, 2));
      console.log('Sessions: TrainingDuration value:', sessionData.trainingDuration);
      console.log('Sessions: TrainingDuration type:', typeof sessionData.trainingDuration);

      const response = await shootingSessionApi.create(sessionData);
      console.log('Sessions: Session created successfully:', response.data);

      // Reload sessions to show the new one
      await loadData();

      // Reset form
      setIsCreateModalOpen(false);
      setSelectedTemplate('');
      setSelectedDiscipline('');
      setSelectedWeapon('');
      setShots([]);
      setCurrentSeries(1);
      setSeriesConfig({ seriesCount: 3, shotsPerSeries: 3 });
      
      // Reset timer
      setIsTimerRunning(false);
      setTimerStarted(false);
      setTimeLeft(timerMinutes * 60 + timerSeconds);
      setSessionStartTime(null);
      setSessionEndTime(null);

    } catch (err) {
      console.error('Sessions: Failed to create session:', err);
      setError(err.message || 'Ошибка создания тренировки');
    } finally {
      setSaving(false);
    }
  };

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStarted(true);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now()); // Record when session actually started
      console.log('Sessions: Session started at:', new Date().toISOString());
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerStarted(false);
    setTimeLeft(timerMinutes * 60 + timerSeconds);
    if (sessionStartTime && !sessionEndTime) {
      setSessionEndTime(Date.now()); // Record when session ended
      console.log('Sessions: Session stopped at:', new Date().toISOString());
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerStarted(false);
    setTimeLeft(timerMinutes * 60 + timerSeconds);
    setSessionStartTime(null);
    setSessionEndTime(null);
  };

  const setTimerPreset = (minutes) => {
    if (!timerStarted) {
      setTimerMinutes(minutes);
      setTimerSeconds(0);
      setTimeLeft(minutes * 60);
    }
  };

  const updateTimerTime = () => {
    if (!timerStarted) {
      setTimeLeft(timerMinutes * 60 + timerSeconds);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const totalTime = timerMinutes * 60 + timerSeconds;
    const percentage = (timeLeft / totalTime) * 100;
    
    if (timeLeft === 0) return 'text-red-600';
    if (percentage <= 10) return 'text-red-500';
    if (percentage <= 25) return 'text-orange-500';
    if (percentage <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressPercentage = () => {
    const totalTime = timerMinutes * 60 + timerSeconds;
    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const filteredSessions = getFilteredAndSortedSessions();

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 animate-pulse">Загружаем тренировки...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Тренировки
              </h1>
              <p className="text-gray-600 mt-2">Отслеживайте и анализируйте ваши результаты</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="mr-2" />
              Новая тренировка
            </button>
          </div>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError('')} 
            className="mb-6" 
          />
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiFilter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Фильтры и поиск</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск тренировок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Discipline Filter */}
            <select
              value={selectedDisciplineFilter}
              onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все дисциплины</option>
              {disciplines.map(discipline => (
                <option key={discipline.id} value={discipline.name}>
                  {discipline.name}
                </option>
              ))}
            </select>

            {/* Weapon Filter */}
            <select
              value={selectedWeaponFilter}
              onChange={(e) => setSelectedWeaponFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все оружие</option>
              {weapons.map(weapon => (
                <option key={weapon.id} value={weapon.name}>
                  {weapon.name}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все даты</option>
              <option value="today">Сегодня</option>
              <option value="week">Последняя неделя</option>
              <option value="month">Последний месяц</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">По дате</option>
              <option value="score">По счету</option>
              <option value="shots">По количеству выстрелов</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {sortOrder === 'asc' ? '↑ По возрастанию' : '↓ По убыванию'}
            </button>
            
            {/* Results count */}
            <span className="text-sm text-gray-500 ml-auto">
              Найдено: {filteredSessions.length} из {sessions.length}
            </span>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дисциплина
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Оружие
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Общий счет
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Выстрелов
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Средний балл
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => {
                    const shotCount = session.shots?.length || 0;
                    const averageScore = shotCount > 0 ? (session.totalScore || 0) / shotCount : 0;
                    
                    return (
                      <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                            {session.date ? format(new Date(session.date), 'PP', { locale: ru }) : 'Не указана'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.discipline || 'Неизвестная дисциплина'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.weaponType || 'Неизвестное оружие'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                            {session.totalScore ? session.totalScore.toFixed(1) : '0.0'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {shotCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">
                            {averageScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/sessions/${session.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Просмотр детальной информации"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Редактировать тренировку"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить тренировку"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          {sessions.length === 0 ? (
                            <FiPlus className="w-8 h-8 text-gray-400" />
                          ) : (
                            <FiSearch className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {sessions.length === 0 ? 'Нет тренировок' : 'Тренировки не найдены'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {sessions.length === 0 
                            ? 'Создайте первую тренировку для начала работы'
                            : 'Попробуйте изменить фильтры поиска'
                          }
                        </p>
                        {sessions.length === 0 && (
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            Создать тренировку
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Session Modal */}
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <Dialog.Title className="text-3xl font-bold text-gray-900">
                    Новая тренировка
                  </Dialog.Title>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Settings */}
                  <div className="space-y-6">
                    {/* Template Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Шаблон упражнения
                      </label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Выберите шаблон для интерактивной мишени</option>
                        {templates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.seriesCount} × {template.shotsPerSeries})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Выберите шаблон для интерактивной мишени
                      </p>
                    </div>

                    {/* Discipline Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дисциплина <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedDiscipline}
                        onChange={(e) => setSelectedDiscipline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Выберите дисциплину</option>
                        {disciplines.map(discipline => (
                          <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Weapon Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Оружие <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedWeapon}
                        onChange={(e) => setSelectedWeapon(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Выберите оружие</option>
                        {weapons.map(weapon => (
                          <option key={weapon.id} value={weapon.id}>
                            {weapon.name} ({weapon.caliber})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timer Section */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                      <div className="flex items-center mb-4">
                        <FiClock className="w-5 h-5 text-orange-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Таймер тренировки</h3>
                      </div>

                      {/* Timer Display */}
                      <div className="text-center mb-6">
                        <div className={`text-4xl font-bold mb-2 ${getTimerColor()}`}>
                          {formatTime(timeLeft)}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${getProgressPercentage()}%` }}
                          />
                        </div>

                        {timeLeft === 0 && (
                          <div className="text-red-600 font-semibold animate-pulse">
                            Время вышло!
                          </div>
                        )}
                      </div>

                      {/* Timer Controls */}
                      <div className="flex justify-center space-x-2 mb-4">
                        <button
                          onClick={isTimerRunning ? pauseTimer : startTimer}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                        >
                          {isTimerRunning ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={stopTimer}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <FiSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={resetTimer}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <FiRotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Timer Settings */}
                      {!timerStarted && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Минуты
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={timerMinutes}
                                onChange={(e) => {
                                  setTimerMinutes(parseInt(e.target.value) || 0);
                                  updateTimerTime();
                                }}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Секунды
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={timerSeconds}
                                onChange={(e) => {
                                  setTimerSeconds(parseInt(e.target.value) || 0);
                                  updateTimerTime();
                                }}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* Quick Presets */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Быстрые настройки
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => setTimerPreset(75)}
                                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                              >
                                75м (10м)
                              </button>
                              <button
                                onClick={() => setTimerPreset(30)}
                                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                              >
                                30м (25м)
                              </button>
                              <button
                                onClick={() => setTimerPreset(90)}
                                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                              >
                                90м (50м)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column - Interactive Target */}
                  <div className="space-y-6">
                    {selectedTemplate ? (
                      <>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {templates.find(t => t.id === selectedTemplate)?.name || 'Тестовый шаблон'}
                            </h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {getTotalScore().toFixed(1)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Выстрелов: {shots.length}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Серия {currentSeries} из {seriesConfig.seriesCount}
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Интерактивная мишень</h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSeriesNavigation('prev')}
                                disabled={!canNavigatePrev()}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                ←
                              </button>
                              <button
                                onClick={() => handleSeriesNavigation('next')}
                                disabled={!canNavigateNext()}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                →
                              </button>
                              <button
                                onClick={resetCurrentSeries}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Сбросить серию"
                              >
                                <FiRotateCcw className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <InteractiveTarget
                            shots={getCurrentSeriesShots()}
                            onShotAdded={handleShotAdded}
                            maxShots={seriesConfig.shotsPerSeries}
                            seriesConfig={seriesConfig}
                            className="mb-6"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <FiPlus className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите шаблон</h3>
                        <p className="text-gray-500">
                          Выберите шаблон упражнения для использования интерактивной мишени
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Progress */}
                  <div className="space-y-6">
                    {selectedTemplate && (
                      <>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Прогресс серий</h3>
                          <div className="space-y-3">
                            {Array.from({ length: seriesConfig.seriesCount }, (_, i) => i + 1).map(seriesNum => {
                              const isActive = seriesNum === currentSeries;
                              const isComplete = isSeriesComplete(seriesNum);
                              const seriesScore = getSeriesScore(seriesNum);
                              const startIndex = (seriesNum - 1) * seriesConfig.shotsPerSeries;
                              const endIndex = startIndex + seriesConfig.shotsPerSeries;
                              const seriesShots = shots.slice(startIndex, endIndex);

                              return (
                                <div
                                  key={seriesNum}
                                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    isActive
                                      ? 'border-blue-300 bg-blue-50'
                                      : isComplete
                                      ? 'border-green-300 bg-green-50'
                                      : 'border-gray-200 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                      Серия {seriesNum}
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                      {seriesScore.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {seriesShots.length}/{seriesConfig.shotsPerSeries}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Выстрелы серии {currentSeries}</h3>
                          <div className="text-center text-gray-600 mb-4">
                            Нажмите на мишень, чтобы сделать выстрел
                          </div>
                          {getCurrentSeriesShots().length > 0 ? (
                            <div className="space-y-2">
                              {getCurrentSeriesShots().map((shot, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                                  <span className="text-sm text-gray-600">Выстрел {index + 1}</span>
                                  <span className="font-semibold text-purple-600">{shot.score.toFixed(1)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              Выстрелы не сделаны
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={saving || !selectedDiscipline || !selectedWeapon || shots.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving && <LoadingSpinner size="sm" className="mr-2" />}
                    {saving ? 'Сохранение...' : 'Создать тренировку'}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}