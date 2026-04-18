import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const mockDisciplines = [
  "10м Пневматическая винтовка",
  "25м Скоростной пистолет",
  "50м Винтовка лёжа"
];

const mockWeapons = [
  {
    id: 1,
    name: "Feinwerkbau 800X",
    caliber: "4.5мм",
    discipline: "10м Пневматическая винтовка",
    approved: true
  },
  {
    id: 2,
    name: "Pardini SP",
    caliber: "5.6мм",
    discipline: "25м Скоростной пистолет",
    approved: true
  },
  {
    id: 3,
    name: "Walther LG400",
    caliber: "4.5мм",
    discipline: "10м Пневматическая винтовка",
    approved: false
  }
];

export default function WeaponTypes() {
  const [weapons, setWeapons] = useState(mockWeapons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [editingWeapon, setEditingWeapon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    caliber: '',
    discipline: '',
    approved: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingWeapon) {
      setWeapons(prev => prev.map(weapon =>
        weapon.id === editingWeapon.id ? { ...formData, id: weapon.id } : weapon
      ));
    } else {
      setWeapons(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingWeapon(null);
    setFormData({
      name: '',
      caliber: '',
      discipline: '',
      approved: false
    });
  };

  const handleDelete = (id) => {
    setWeapons(prev => prev.filter(weapon => weapon.id !== id));
  };

  const filteredWeapons = selectedDiscipline === 'all'
    ? weapons
    : weapons.filter(weapon => weapon.discipline === selectedDiscipline);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Типы оружия</h1>
            <p className="text-gray-600">Управление спортивным оружием</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="rounded-lg border-gray-300 text-gray-700 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Все дисциплины</option>
              {mockDisciplines.map(discipline => (
                <option key={discipline} value={discipline}>{discipline}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setEditingWeapon(null);
                setFormData({
                  name: '',
                  caliber: '',
                  discipline: '',
                  approved: false
                });
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <FiPlus className="mr-2" />
              Добавить оружие
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeapons.map(weapon => (
            <div
              key={weapon.id}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{weapon.name}</h3>
                  <p className="text-sm text-gray-500">{weapon.discipline}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingWeapon(weapon);
                      setFormData(weapon);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(weapon.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Калибр</span>
                  <span className="text-sm font-medium text-gray-900">{weapon.caliber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Статус</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    weapon.approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {weapon.approved ? (
                      <FiCheck className="w-4 h-4 mr-1" />
                    ) : (
                      <FiX className="w-4 h-4 mr-1" />
                    )}
                    {weapon.approved ? 'Одобрено' : 'Не одобрено'}
                  </span>
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
                {editingWeapon ? 'Редактировать оружие' : 'Добавить новое оружие'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название оружия
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="например, Feinwerkbau 800X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Калибр
                  </label>
                  <input
                    type="text"
                    name="caliber"
                    required
                    value={formData.caliber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="например, 4.5мм"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дисциплина
                  </label>
                  <select
                    name="discipline"
                    required
                    value={formData.discipline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Выберите дисциплину</option>
                    {mockDisciplines.map(discipline => (
                      <option key={discipline} value={discipline}>
                        {discipline}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="approved"
                    id="approved"
                    checked={formData.approved}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="approved" className="ml-2 block text-sm text-gray-900">
                    Одобрено для соревнований
                  </label>
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
                    {editingWeapon ? 'Сохранить изменения' : 'Добавить оружие'}
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