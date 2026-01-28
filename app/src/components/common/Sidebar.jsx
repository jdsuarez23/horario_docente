import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '../../hooks/useAuth';
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    path: '/dashboard',
    roles: ['admin', 'coordinador', 'docente']
  },
  {
    name: 'Docentes',
    icon: UsersIcon,
    path: '/docentes',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Competencias',
    icon: BookOpenIcon,
    path: '/competencias',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Programas',
    icon: AcademicCapIcon,
    path: '/programas',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Fichas',
    icon: UserGroupIcon,
    path: '/fichas',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Salones',
    icon: BuildingOfficeIcon,
    path: '/salones',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Horarios',
    icon: ClockIcon,
    path: '/horarios',
    roles: ['admin', 'coordinador', 'docente']
  },
  {
    name: 'Reportes',
    icon: ChartBarIcon,
    path: '/reportes',
    roles: ['admin', 'coordinador']
  },
  {
    name: 'Configuración',
    icon: Cog6ToothIcon,
    path: '/configuracion',
    roles: ['admin']
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, isCoordinador, isDocente } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const hasRoleAccess = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const filteredMenuItems = menuItems.filter(item => hasRoleAccess(item.roles));

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-sena-primary text-white p-2 rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sena-primary text-white transition-transform duration-300 ease-in-out`}>
        {/* Close button for mobile */}
        <div className="flex justify-end lg:hidden p-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-sena-primary-light">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sena-secondary rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SENA Horarios</h1>
              <p className="text-xs text-sena-neutral-light">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-sena-primary-light">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sena-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-sena-neutral capitalize">{user?.rol}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-sena-secondary text-white'
                        : 'text-white hover:bg-sena-primary-light hover:text-sena-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sena-primary-light">
          <Link
            to="/logout"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-sena-danger transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Cerrar Sesión</span>
          </Link>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;