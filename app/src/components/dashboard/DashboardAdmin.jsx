import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import {
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    generales: {},
    horariosPorDia: [],
    salonesMasOcupados: [],
    docentesConMasHorarios: []
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
    },
    {
      title: 'Total Programas',
      value: stats.generales?.total_programas || 0,
      icon: AcademicCapIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Total Competencias',
      value: stats.generales?.total_competencias || 0,
      icon: BookOpenIcon,
      color: 'bg-indigo-500'
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
        <h1 className="text-2xl font-bold text-sena-primary">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de control del sistema de gestión de horarios</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horarios por día */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-sena-primary mb-4">Horarios por Día</h3>
          <div className="space-y-3">
            {stats.horariosPorDia.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{item.dia}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sena-secondary h-2 rounded-full"
                      style={{ width: `${(item.total_horarios / Math.max(...stats.horariosPorDia.map(h => h.total_horarios))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {item.total_horarios}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salones más ocupados */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-sena-primary mb-4">Salones Más Ocupados</h3>
          <div className="space-y-3">
            {stats.salonesMasOcupados.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-500">Número: {item.numero}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sena-secondary">{item.total_horarios}</p>
                  <p className="text-xs text-gray-500">horarios</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Docentes con más horarios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-sena-primary mb-4">Docentes con Más Horarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.docentesConMasHorarios.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-sena-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {item.nombre_apellido.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.nombre_apellido}</p>
                <p className="text-sm text-sena-secondary font-semibold">{item.total_horarios} horarios</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;