import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import {
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DashboardCoordinador = () => {
  const [stats, setStats] = useState({
    generales: {},
    horariosPorDia: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Docentes',
      value: stats.generales?.total_docentes || 0,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Fichas',
      value: stats.generales?.total_fichas || 0,
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Salones',
      value: stats.generales?.total_salones || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Horarios',
      value: stats.generales?.total_horarios || 0,
      icon: ClockIcon,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sena-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-sena-primary">Dashboard Coordinador</h1>
        <p className="text-gray-600 mt-2">Panel de control para coordinadores</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Horarios por día */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-sena-primary mb-4">Distribución de Horarios por Día</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.horariosPorDia.map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-700 capitalize">{item.dia}</p>
              <p className="text-3xl font-bold text-sena-secondary mt-2">{item.total_horarios}</p>
              <p className="text-sm text-gray-500">horarios</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-sena-primary mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/docentes"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UsersIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Docentes</p>
              <p className="text-sm text-gray-500">Gestión de instructores</p>
            </div>
          </a>
          <a
            href="/fichas"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <UserGroupIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Fichas</p>
              <p className="text-sm text-gray-500">Gestión de grupos</p>
            </div>
          </a>
          <a
            href="/horarios"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <ClockIcon className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Horarios</p>
              <p className="text-sm text-gray-500">Programación de clases</p>
            </div>
          </a>
          <a
            href="/salones"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BuildingOfficeIcon className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Salones</p>
              <p className="text-sm text-gray-500">Gestión de espacios</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardCoordinador;