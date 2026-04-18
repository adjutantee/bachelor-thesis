import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">Ballista</Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/sessions" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Тренировки
              </Link>
            </div>
          </div>
          
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors">
              <span className="text-primary-700 text-sm font-medium">
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.roles && user.roles.length > 0 && (
                      <div className="mt-1">
                        {user.roles.map((role, index) => (
                          <span 
                            key={index}
                            className={`inline-block px-2 py-0.5 text-xs rounded-full mr-1 ${
                              role === 'Admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-primary-50 text-primary-900' : 'text-gray-700'
                        } block px-4 py-2 text-sm`}
                      >
                        Профиль
                      </Link>
                    )}
                  </Menu.Item>
                  {isAdmin && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin"
                          className={`${
                            active ? 'bg-primary-50 text-primary-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          <div className="flex items-center">
                            <span>Панель администратора</span>
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                              Admin
                            </span>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-primary-50 text-primary-900' : 'text-gray-700'
                        } block px-4 py-2 text-sm`}
                      >
                        Настройки
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-primary-50 text-primary-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        Выйти
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
}