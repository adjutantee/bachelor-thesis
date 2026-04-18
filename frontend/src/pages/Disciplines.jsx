import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiTarget, FiEdit2, FiTrash2, FiPlus, FiAward, FiClock } from 'react-icons/fi';

const mockDisciplines = [
  {
    id: 1,
    name: '10м Пневматическая винтовка',
    description: 'Олимпийская дисциплина, стрельба из пневматической винтовки калибра 4.5мм (.177) на дистанции 10 метров.',
    targetDiameter: 45.5,
    distance: 10,
    timeLimit: '75 минут',
    totalShots: 60,
    qualification: '654.0'
  },
  {
    id: 2,
    name: '25м Скоростной пистолет',
    description: 'Олимпийская дисциплина, скоростная стрельба из пистолета по нескольким мишеням.',
    targetDiameter: 500,
    distance: 25,
    timeLimit: '8/6/4 секунды',
    totalShots: 60,
    qualification: '591'
  }
];

export default function Disciplines() {
  const [disciplines, setDisciplines] = useState(mockDisciplines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetDiameter: '',
    distance: '',
    timeLimit: '',
    totalShots: '',
    qualification: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (discipline) => {
    setEditingDiscipline(discipline);
    setFormData(discipline);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDisciplines(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDiscipline) {
      setDisciplines(prev => prev.map(d => 
        d.id === editingDiscipline.id ? { ...formData, id: d.id } : d
      ));
    } else {
      setDisciplines(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingDiscipline(null);
    setFormData({
      name: '',
      description: '',
      targetDiameter: '',
      distance: '',
      timeLimit: '',
      totalShots: '',
      qualification: ''
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Стрелковые дисциплины</h1>
            <p className="text-gray-600">Управление стрелковыми дисциплинами и их характеристиками</p>
          </div>
          <button
            onClick={() => {
              setEditingDiscipline(null);
              setFormData({
                name: '',
                description: '',
                targetDiameter: '',
                distance: '',
                timeLimit: '',
                totalShots: '',
                qualification: ''
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Добавить дисциплину
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {disciplines.map(discipline => (
            <div 
              key={discipline.id} 
              className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{discipline.name}</h3>
                  <p className="text-gray-600">{discipline.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(discipline)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(discipline.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FiTarget className="w-5 h-5 text-primary-600 mr-2" />
                    <p className="text-sm font-medium text-primary-600">Размер мишени</p>
                  </div>
                  <p className="text-xl font-bold text-primary-800">{discipline.targetDiameter}мм</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FiTarget className="w-5 h-5 text-primary-600 mr-2" />
                    <p className="text-sm font-medium text-primary-600">Дистанция</p>
                  </div>
                  <p className="text-xl font-bold text-primary-800">{discipline.distance}м</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Время:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{discipline.timeLimit}</span>
                  </div>
                  <div className="flex items-center">
                    <FiTarget className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Выстрелов:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{discipline.totalShots}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Квалификация:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{discipline.qualification}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                {editingDiscipline ? 'Редактировать дисциплину' : 'Добавить новую дисциплину'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="например, 10м Пневматическая винтовка"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Краткое описание дисциплины..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Размер мишени (мм)
                    </label>
                    <input
                      type="number"
                      name="targetDiameter"
                      required
                      min="0"
                      step="0.1"
                      value={formData.targetDiameter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дистанция (м)
                    </label>
                    <input
                      type="number"
                      name="distance"
                      required
                      min="0"
                      step="0.1"
                      value={formData.distance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Время
                    </label>
                    <input
                      type="text"
                      name="timeLimit"
                      required
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="например, 75 минут"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество выстрелов
                    </label>
                    <input
                      type="number"
                      name="totalShots"
                      required
                      min="0"
                      value={formData.totalShots}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Квалификационный норматив
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    required
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105"
                  >
                    {editingDiscipline ? 'Сохранить изменения' : 'Добавить дисциплину'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}