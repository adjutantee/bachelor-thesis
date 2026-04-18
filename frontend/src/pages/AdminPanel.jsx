import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRotateCcw, FiSettings, FiDatabase, FiTarget, FiLayers, FiUsers, FiActivity } from 'react-icons/fi';
import { disciplineApi, weaponTypeApi, exerciseTemplateApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminPanel() {
  const [disciplines, setDisciplines] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal states
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [editingWeapon, setEditingWeapon] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Search states
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [weaponSearch, setWeaponSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');

  // Form states
  const [disciplineForm, setDisciplineForm] = useState({
    name: '',
    description: ''
  });
  const [weaponForm, setWeaponForm] = useState({
    name: '',
    caliber: '',
    disciplineId: ''
  });
  const [templateForm, setTemplateForm] = useState({
    name: '',
    disciplineId: '',
    disciplineName: '',
    seriesCount: 6,
    shotsPerSeries: 10
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load disciplines first
      const disciplinesRes = await disciplineApi.getAll();
      setDisciplines(disciplinesRes.data || []);

      // Load all weapons using the correct endpoint
      try {
        const weaponsRes = await weaponTypeApi.getAll();
        setWeapons(weaponsRes.data || []);
      } catch (weaponError) {
        console.error('Failed to load weapons:', weaponError);
        setWeapons([]);
      }

      // Try to load templates with better error handling
      try {
        const templatesRes = await exerciseTemplateApi.getAll();
        setTemplates(templatesRes.data || []);
      } catch (templateError) {
        console.error('Failed to load exercise templates:', templateError);
        setTemplates([]);
        
        // Check if it's a 404 error (endpoint doesn't exist)
        if (templateError.message.includes('404') || templateError.message.includes('Not Found')) {
          setError('Эндпоинт для шаблонов упражнений не найден. Проверьте, что контроллер exercise-templates существует в API.');
        } else if (templateError.message.includes('403') || templateError.message.includes('Forbidden')) {
          setError('У вас нет прав доступа к шаблонам упражнений. Обратитесь к администратору.');
        } else {
          setError(`Ошибка загрузки шаблонов: ${templateError.message}`);
        }
      }

    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredDisciplines = useMemo(() => {
    return disciplines.filter(discipline =>
      discipline.name?.toLowerCase().includes(disciplineSearch.toLowerCase()) ||
      discipline.description?.toLowerCase().includes(disciplineSearch.toLowerCase())
    );
  }, [disciplines, disciplineSearch]);

  const filteredWeapons = useMemo(() => {
    return weapons.filter(weapon =>
      weapon.name?.toLowerCase().includes(weaponSearch.toLowerCase()) ||
      weapon.caliber?.toLowerCase().includes(weaponSearch.toLowerCase())
    );
  }, [weapons, weaponSearch]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template =>
      template.name?.toLowerCase().includes(templateSearch.toLowerCase()) ||
      template.disciplineName?.toLowerCase().includes(templateSearch.toLowerCase())
    );
  }, [templates, templateSearch]);

  // Discipline handlers
  const handleDisciplineSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      const disciplineData = {
        name: disciplineForm.name,
        description: disciplineForm.description
      };

      if (editingDiscipline) {
        await disciplineApi.update(editingDiscipline.id, disciplineData);
        setDisciplines(prev => prev.map(d => 
          d.id === editingDiscipline.id ? { ...disciplineData, id: editingDiscipline.id } : d
        ));
      } else {
        const response = await disciplineApi.create(disciplineData);
        if (response.data) {
          setDisciplines(prev => [...prev, response.data]);
        }
      }

      setIsDisciplineModalOpen(false);
      setEditingDiscipline(null);
      setDisciplineForm({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to save discipline:', err);
      setError(err.message || 'Ошибка сохранения дисциплины');
    } finally {
      setSaving(false);
    }
  };

  // Weapon handlers - Note: No update operation since API doesn't support it
  const handleWeaponSubmit = async (e) => {
    e.preventDefault();
    
    // Since WeaponType API doesn't have update endpoint, only allow creation
    if (editingWeapon) {
      setError('Редактирование оружия не поддерживается API. Удалите и создайте заново.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const weaponData = {
        name: weaponForm.name,
        caliber: weaponForm.caliber,
        disciplineId: weaponForm.disciplineId
      };

      const response = await weaponTypeApi.create(weaponData);
      if (response.data) {
        setWeapons(prev => [...prev, response.data]);
      }

      setIsWeaponModalOpen(false);
      setEditingWeapon(null);
      setWeaponForm({ name: '', caliber: '', disciplineId: '' });
    } catch (err) {
      console.error('Failed to save weapon:', err);
      setError(err.message || 'Ошибка сохранения оружия');
    } finally {
      setSaving(false);
    }
  };

  // Template handlers
  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      // Find the discipline name for the selected discipline
      const selectedDiscipline = disciplines.find(d => d.id === templateForm.disciplineId);
      
      // Match the exact structure expected by your ASP.NET Core API
      const templateData = {
        name: templateForm.name,
        disciplineId: templateForm.disciplineId,
        disciplineName: selectedDiscipline?.name || '',
        seriesCount: parseInt(templateForm.seriesCount),
        shotsPerSeries: parseInt(templateForm.shotsPerSeries)
      };

      console.log('Creating template with data:', templateData);

      if (editingTemplate) {
        await exerciseTemplateApi.update(editingTemplate.id, templateData);
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t
        ));
      } else {
        const response = await exerciseTemplateApi.create(templateData);
        console.log('Template creation response:', response);
        if (response.data) {
          setTemplates(prev => [...prev, response.data]);
        }
      }

      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        disciplineId: '',
        disciplineName: '',
        seriesCount: 6,
        shotsPerSeries: 10
      });
    } catch (err) {
      console.error('Failed to save template:', err);
      console.error('Template error details:', err.response?.data);
      
      // Provide specific error message for different scenarios
      if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Эндпоинт /exercise-templates не найден. Убедитесь, что контроллер существует в вашем ASP.NET Core API.');
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('У вас нет прав доступа для создания шаблонов упражнений. Обратитесь к администратору.');
      } else if (err.message.includes('500')) {
        setError('Внутренняя ошибка сервера. Проверьте, что модель ExerciseTemplate соответствует отправляемым данным.');
      } else {
        setError(err.message || 'Ошибка сохранения шаблона');
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const confirmDelete = (type, id) => {
    setDeleteConfirmation({ type, id });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      setSaving(true);
      setError('');

      switch (deleteConfirmation.type) {
        case 'discipline':
          await disciplineApi.delete(deleteConfirmation.id);
          setDisciplines(prev => prev.filter(d => d.id !== deleteConfirmation.id));
          break;
        case 'weapon':
          await weaponTypeApi.delete(deleteConfirmation.id);
          setWeapons(prev => prev.filter(w => w.id !== deleteConfirmation.id));
          break;
        case 'template':
          try {
            await exerciseTemplateApi.delete(deleteConfirmation.id);
            setTemplates(prev => prev.filter(t => t.id !== deleteConfirmation.id));
          } catch (deleteError) {
            console.error('Template delete error:', deleteError);
            
            // Handle specific delete errors
            if (deleteError.message.includes('404') || deleteError.message.includes('Not Found')) {
              setError('Удаление шаблонов не поддерживается API. Эндпоинт DELETE /exercise-templates/{id} не найден.');
            } else if (deleteError.message.includes('405') || deleteError.message.includes('Method Not Allowed')) {
              setError('Удаление шаблонов не поддерживается API. Метод DELETE не разрешен для этого эндпоинта.');
            } else {
              setError(`Ошибка удаления шаблона: ${deleteError.message}`);
            }
            return; // Don't close the confirmation dialog on error
          }
          break;
      }

      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      
      // Provide specific error message for 403
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('У вас нет прав доступа для удаления этого элемента. Обратитесь к администратору.');
      } else {
        setError(err.message || 'Ошибка удаления');
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get discipline name by ID
  const getDisciplineName = (disciplineId) => {
    const discipline = disciplines.find(d => d.id === disciplineId);
    return discipline?.name || 'Неизвестная дисциплина';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 animate-pulse">Загружаем панель администратора...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
              <FiSettings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Панель администратора
              </h1>
              <p className="text-gray-600 mt-1">Управление системными данными и настройками</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <FiTarget className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{disciplines.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mt-4">Дисциплины</h3>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <FiDatabase className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{weapons.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mt-4">Типы оружия</h3>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <FiLayers className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{templates.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mt-4">Шаблоны упражнений</h3>
            </div>
          </div>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError('')} 
            className="mb-6" 
          />
        )}

        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-2xl bg-white p-2 shadow-lg border border-gray-100 mb-8">
            {[
              { name: 'Дисциплины', icon: FiTarget, color: 'from-blue-500 to-blue-600' },
              { name: 'Типы оружия', icon: FiDatabase, color: 'from-emerald-500 to-emerald-600' },
              { name: 'Шаблоны упражнений', icon: FiLayers, color: 'from-purple-500 to-purple-600' }
            ].map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex-1 rounded-xl py-4 px-6 text-sm font-medium leading-5 transition-all duration-200 flex items-center justify-center space-x-2
                  ${selected
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Disciplines Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Управление дисциплинами</h2>
                      <p className="text-gray-600">Создавайте и редактируйте стрелковые дисциплины</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingDiscipline(null);
                        setDisciplineForm({ name: '', description: '' });
                        setIsDisciplineModalOpen(true);
                      }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="mr-2" />
                      Добавить дисциплину
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        placeholder="Поиск дисциплин..."
                        value={disciplineSearch}
                        onChange={(e) => setDisciplineSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                      />
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDisciplines.map(discipline => (
                      <div 
                        key={discipline.id} 
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                              {discipline.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{discipline.description}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingDiscipline(discipline);
                                setDisciplineForm({
                                  name: discipline.name,
                                  description: discipline.description
                                });
                                setIsDisciplineModalOpen(true);
                              }}
                              className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => confirmDelete('discipline', discipline.id)}
                              className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredDisciplines.length === 0 && (
                      <div className="col-span-2 text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <FiTarget className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Дисциплины не найдены</h3>
                        <p className="text-gray-500">Создайте первую дисциплину для начала работы</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Weapons Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Управление оружием</h2>
                      <p className="text-gray-600">Добавляйте типы спортивного оружия</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingWeapon(null);
                        setWeaponForm({ name: '', caliber: '', disciplineId: '' });
                        setIsWeaponModalOpen(true);
                      }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="mr-2" />
                      Добавить оружие
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        placeholder="Поиск оружия..."
                        value={weaponSearch}
                        onChange={(e) => setWeaponSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
                      />
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredWeapons.map(weapon => (
                      <div 
                        key={weapon.id} 
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:from-emerald-50 hover:to-teal-50 border border-gray-200 hover:border-emerald-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-900 transition-colors">
                              {weapon.name}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Калибр:</span>
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                  {weapon.caliber}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Дисциплина:</span>
                                <span className="text-xs text-gray-700 font-medium">
                                  {getDisciplineName(weapon.disciplineId)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => confirmDelete('weapon', weapon.id)}
                              className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredWeapons.length === 0 && (
                      <div className="col-span-3 text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <FiDatabase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Оружие не найдено</h3>
                        <p className="text-gray-500">Добавьте первое оружие для начала работы</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Templates Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Шаблоны упражнений</h2>
                      <p className="text-gray-600">Создавайте шаблоны для тренировок</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTemplate(null);
                        setTemplateForm({
                          name: '',
                          disciplineId: '',
                          disciplineName: '',
                          seriesCount: 6,
                          shotsPerSeries: 10
                        });
                        setIsTemplateModalOpen(true);
                      }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="mr-2" />
                      Добавить шаблон
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        placeholder="Поиск шаблонов..."
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                      />
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                      <div 
                        key={template.id} 
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:from-purple-50 hover:to-pink-50 border border-gray-200 hover:border-purple-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-900 transition-colors">
                                {template.name}
                              </h3>
                              <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-sm">
                                {template.seriesCount} × {template.shotsPerSeries}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Дисциплина:</span>
                                <span className="text-xs text-gray-700 font-medium">
                                  {template.disciplineName || getDisciplineName(template.disciplineId)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Всего выстрелов:</span>
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  {template.seriesCount * template.shotsPerSeries}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingTemplate(template);
                                setTemplateForm({
                                  name: template.name,
                                  disciplineId: template.disciplineId,
                                  disciplineName: template.disciplineName,
                                  seriesCount: template.seriesCount,
                                  shotsPerSeries: template.shotsPerSeries
                                });
                                setIsTemplateModalOpen(true);
                              }}
                              className="p-3 text-purple-600 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => confirmDelete('template', template.id)}
                              className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                              title="Удаление может не поддерживаться API"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <div className="col-span-3 text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <FiLayers className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {templates.length === 0 && error.includes('найден') 
                            ? 'Эндпоинт для шаблонов не найден'
                            : 'Шаблоны не найдены'
                          }
                        </h3>
                        <p className="text-gray-500">
                          {templates.length === 0 && error.includes('найден')
                            ? 'Проверьте настройки API'
                            : 'Создайте первый шаблон для начала работы'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Discipline Modal */}
        <Dialog
          open={isDisciplineModalOpen}
          onClose={() => setIsDisciplineModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white mr-3">
                  <FiTarget className="w-6 h-6" />
                </div>
                {editingDiscipline ? 'Редактировать дисциплину' : 'Добавить дисциплину'}
              </Dialog.Title>

              <form onSubmit={handleDisciplineSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={disciplineForm.name}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Например, 10м Пневматическая винтовка"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={disciplineForm.description}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                    required
                    placeholder="Подробное описание дисциплины..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsDisciplineModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <LoadingSpinner size="sm" className="mr-2" />}
                    {editingDiscipline ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Weapon Modal */}
        <Dialog
          open={isWeaponModalOpen}
          onClose={() => setIsWeaponModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white mr-3">
                  <FiDatabase className="w-6 h-6" />
                </div>
                Добавить оружие
              </Dialog.Title>

              {editingWeapon && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    Редактирование оружия не поддерживается. Удалите и создайте заново.
                  </p>
                </div>
              )}

              <form onSubmit={handleWeaponSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={weaponForm.name}
                    onChange={(e) => setWeaponForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={!!editingWeapon}
                    placeholder="Например, Feinwerkbau 800X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Калибр
                  </label>
                  <input
                    type="text"
                    value={weaponForm.caliber}
                    onChange={(e) => setWeaponForm(prev => ({ ...prev, caliber: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={!!editingWeapon}
                    placeholder="Например, 4.5мм"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дисциплина
                  </label>
                  <select
                    value={weaponForm.disciplineId}
                    onChange={(e) => setWeaponForm(prev => ({ ...prev, disciplineId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={!!editingWeapon}
                  >
                    <option value="">Выберите дисциплину</option>
                    {disciplines.map(discipline => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsWeaponModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Отмена
                  </button>
                  {!editingWeapon && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving && <LoadingSpinner size="sm" className="mr-2" />}
                      Добавить
                    </button>
                  )}
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Template Modal */}
        <Dialog
          open={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white mr-3">
                  <FiLayers className="w-6 h-6" />
                </div>
                {editingTemplate ? 'Редактировать шаблон' : 'Добавить шаблон'}
              </Dialog.Title>

              <form onSubmit={handleTemplateSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Например, Стандартная тренировка"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дисциплина
                  </label>
                  <select
                    value={templateForm.disciplineId}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, disciplineId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Количество серий
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={templateForm.seriesCount}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, seriesCount: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выстрелов в серии
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={templateForm.shotsPerSeries}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, shotsPerSeries: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-purple-800 font-medium">
                    Всего выстрелов: {templateForm.seriesCount * templateForm.shotsPerSeries}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <LoadingSpinner size="sm" className="mr-2" />}
                    {editingTemplate ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-8 h-8 text-red-600" />
                </div>
                <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                  Подтверждение удаления
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.
                  {deleteConfirmation?.type === 'template' && (
                    <span className="block mt-2 text-sm text-yellow-600">
                      Примечание: Удаление шаблонов может не поддерживаться API.
                    </span>
                  )}
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setDeleteConfirmation(null)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <LoadingSpinner size="sm" className="mr-2" />}
                    Удалить
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
