import React, { useState, useEffect } from 'react';
import { dashboardService, docentesService, fichasService, salonesService, horariosService } from '../../services/api';
import {
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    generales: {},
    horariosPorDia: [],
    salonesMasOcupados: [],
    docentesConMasHorarios: []
  });
  const [loading, setLoading] = useState(true);
  
  // Estados para secciones expandibles
  const [expandedSections, setExpandedSections] = useState({
    docentes: false,
    fichas: false,
    salones: false
  });
  
  // Estados para datos
  const [docentes, setDocentes] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [salones, setSalones] = useState([]);
  const [dataLoading, setDataLoading] = useState({
    docentes: false,
    fichas: false,
    salones: false
  });
  
  // Estado para detalles
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [docenteHorarios, setDocenteHorarios] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [salonHorarios, setSalonHorarios] = useState([]);

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

  const toggleSection = async (section) => {
    if (expandedSections[section]) {
      // Cerrar sección
      setExpandedSections({ ...expandedSections, [section]: false });
      setSelectedDocente(null);
      setSelectedSalon(null);
    } else {
      // Abrir sección - cargar datos
      if (section === 'docentes' && docentes.length === 0) {
        await loadDocentes();
      } else if (section === 'fichas' && fichas.length === 0) {
        await loadFichas();
      } else if (section === 'salones' && salones.length === 0) {
        await loadSalones();
      }
      setExpandedSections({ ...expandedSections, [section]: true });
    }
  };

  const loadDocentes = async () => {
    setDataLoading(prev => ({ ...prev, docentes: true }));
    try {
      const response = await docentesService.getAll();
      setDocentes(response.data || []);
    } catch (error) {
      console.error('Error loading docentes:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, docentes: false }));
    }
  };

  const loadFichas = async () => {
    setDataLoading(prev => ({ ...prev, fichas: true }));
    try {
      const response = await fichasService.getAll();
      setFichas(response.data || []);
    } catch (error) {
      console.error('Error loading fichas:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, fichas: false }));
    }
  };

  const loadSalones = async () => {
    setDataLoading(prev => ({ ...prev, salones: true }));
    try {
      const response = await salonesService.getAll();
      setSalones(response.data || []);
    } catch (error) {
      console.error('Error loading salones:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, salones: false }));
    }
  };

  const handleSelectDocente = async (docente) => {
    setSelectedDocente(docente);
    try {
      const response = await horariosService.getByDocente(docente.id_docente);
      setDocenteHorarios(response.data || []);
    } catch (error) {
      console.error('Error loading docente horarios:', error);
      setDocenteHorarios([]);
    }
  };

  const handleSelectSalon = async (salon) => {
    setSelectedSalon(salon);
    try {
      const response = await horariosService.getBySalon(salon.id_salon);
      setSalonHorarios(response.data || []);
    } catch (error) {
      console.error('Error loading salon horarios:', error);
      setSalonHorarios([]);
    }
  };

  const exportToExcel = async () => {
    try {
      // Cargar datos si no existen
      if (docentes.length === 0) await loadDocentes();
      if (fichas.length === 0) await loadFichas();
      if (salones.length === 0) await loadSalones();

      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen
      const statsData = [
        ['RESUMEN DEL DASHBOARD ADMINISTRATIVO'],
        [],
        ['Métrica', 'Total'],
        ['Total Docentes', stats.generales?.total_docentes || 0],
        ['Total Fichas', stats.generales?.total_fichas || 0],
        ['Total Salones', stats.generales?.total_salones || 0],
        ['Total Horarios', stats.generales?.total_horarios || 0],
        ['Total Programas', stats.generales?.total_programas || 0],
        ['Total Competencias', stats.generales?.total_competencias || 0]
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(statsData);
      ws1['!cols'] = [{ wch: 35 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

      // Hoja 2: Listado de Docentes
      const docentesRows = [
        ['LISTADO DE DOCENTES'],
        [],
        ['Nombre', 'Documento', 'Correo', 'Celular'],
        ...docentes.map(d => [
          d.nombre_apellido || '',
          d.numero_documento || '',
          d.correo || '',
          d.celular || ''
        ])
      ];
      const wsDocentes = XLSX.utils.aoa_to_sheet(docentesRows);
      wsDocentes['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 35 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsDocentes, 'Docentes');

      // Hoja 3: Listado de Fichas
      const fichasRows = [
        ['LISTADO DE FICHAS'],
        [],
        ['Código', 'Programa', 'Trimestre', 'Fecha Inicio', 'Fecha Fin'],
        ...fichas.map(f => [
          f.codigo || '',
          f.programa_nombre || '',
          f.trimestre || '-',
          f.fecha_inicio ? new Date(f.fecha_inicio).toLocaleDateString('es-CO') : '-',
          f.fecha_fin ? new Date(f.fecha_fin).toLocaleDateString('es-CO') : '-'
        ])
      ];
      const wsFichas = XLSX.utils.aoa_to_sheet(fichasRows);
      wsFichas['!cols'] = [{ wch: 15 }, { wch: 35 }, { wch: 12 }, { wch: 16 }, { wch: 16 }];
      XLSX.utils.book_append_sheet(wb, wsFichas, 'Fichas');

      // Hoja 4: Listado de Salones
      const salonesRows = [
        ['LISTADO DE SALONES'],
        [],
        ['Nombre', 'Número', 'Capacidad', 'Ubicación'],
        ...salones.map(s => [
          s.nombre || '',
          s.numero || '',
          s.capacidad || 0,
          s.ubicacion || ''
        ])
      ];
      const wsSalones = XLSX.utils.aoa_to_sheet(salonesRows);
      wsSalones['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, wsSalones, 'Salones');

      // Hoja 5: Horarios por Día
      const horariosData = [['HORARIOS POR DÍA'], [], ['Día', 'Total Horarios'], ...stats.horariosPorDia.map(h => [h.dia, h.total_horarios])];
      const ws5 = XLSX.utils.aoa_to_sheet(horariosData);
      ws5['!cols'] = [{ wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws5, 'Horarios por Día');

      const fileName = `Dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error al exportar a Excel');
    }
  };

  const statCards = [
    {
      title: 'Total Docentes',
      value: stats.generales?.total_docentes || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      section: 'docentes'
    },
    {
      title: 'Total Fichas',
      value: stats.generales?.total_fichas || 0,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      section: 'fichas'
    },
    {
      title: 'Total Salones',
      value: stats.generales?.total_salones || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      section: 'salones'
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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-sena-primary">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de control del sistema de gestión de horarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <button
            key={index}
            onClick={() => card.section && toggleSection(card.section)}
            className={`bg-white rounded-lg shadow p-6 ${card.section ? 'hover:shadow-lg transition-shadow hover:cursor-pointer' : ''}`}
          >
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={exportToExcel}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span>Descargar Dashboard (Excel)</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('docentes')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold text-sena-primary">Listado de Docentes</h2>
          {expandedSections.docentes ? (
            <ChevronUpIcon className="w-6 h-6 text-sena-primary" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-sena-primary" />
          )}
        </button>

        {expandedSections.docentes && (
          <div className="border-t p-6">
            {dataLoading.docentes ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sena-secondary"></div>
              </div>
            ) : selectedDocente ? (
              <div>
                <button
                  onClick={() => setSelectedDocente(null)}
                  className="mb-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  ← Volver a Docentes
                </button>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-sena-primary mb-2">{selectedDocente.nombre_apellido}</h3>
                  <p className="text-gray-600">Documento: {selectedDocente.numero_documento}</p>
                  <p className="text-gray-600">Correo: {selectedDocente.correo}</p>
                  <p className="text-gray-600">Celular: {selectedDocente.celular}</p>
                </div>

                <h4 className="text-lg font-semibold text-sena-primary mb-4">Clases del Docente</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-sena-primary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Día</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Horario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Ficha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Competencia</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Salón</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {docenteHorarios.length > 0 ? (
                        docenteHorarios.map((horario, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm capitalize text-gray-900">{horario.dia}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.hora_inicio} - {horario.hora_fin}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.ficha_codigo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.competencia_nombre}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.salon_nombre} {horario.salon_numero}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                            No hay horarios asignados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-sena-primary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Documento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Correo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {docentes.map((docente) => (
                      <tr key={docente.id_docente} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{docente.nombre_apellido}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{docente.numero_documento}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{docente.correo}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleSelectDocente(docente)}
                            className="px-3 py-1 bg-sena-secondary hover:bg-sena-secondary-dark text-white rounded text-xs"
                          >
                            Ver Horarios
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('fichas')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold text-sena-primary">Listado de Fichas</h2>
          {expandedSections.fichas ? (
            <ChevronUpIcon className="w-6 h-6 text-sena-primary" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-sena-primary" />
          )}
        </button>

        {expandedSections.fichas && (
          <div className="border-t p-6">
            {dataLoading.fichas ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sena-secondary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-sena-primary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Programa</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Trimestre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Fecha Inicio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Fecha Fin</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fichas.map((ficha) => (
                      <tr key={ficha.id_ficha} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ficha.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{ficha.programa_nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{ficha.trimestre || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(ficha.fecha_inicio).toLocaleDateString('es-CO')}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(ficha.fecha_fin).toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('salones')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold text-sena-primary">Listado de Salones</h2>
          {expandedSections.salones ? (
            <ChevronUpIcon className="w-6 h-6 text-sena-primary" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-sena-primary" />
          )}
        </button>

        {expandedSections.salones && (
          <div className="border-t p-6">
            {dataLoading.salones ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sena-secondary"></div>
              </div>
            ) : selectedSalon ? (
              <div>
                <button
                  onClick={() => setSelectedSalon(null)}
                  className="mb-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  ← Volver a Salones
                </button>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-sena-primary mb-2">{selectedSalon.nombre}</h3>
                  <p className="text-gray-600">Número: {selectedSalon.numero}</p>
                  <p className="text-gray-600">Capacidad: {selectedSalon.capacidad} personas</p>
                  <p className="text-gray-600">Ubicación: {selectedSalon.ubicacion}</p>
                </div>

                <h4 className="text-lg font-semibold text-sena-primary mb-4">Horarios del Salón</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-sena-primary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Día</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Horario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Ficha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Trimestre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Instructor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salonHorarios.length > 0 ? (
                        salonHorarios.map((horario, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm capitalize text-gray-900">{horario.dia}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.hora_inicio} - {horario.hora_fin}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.ficha_codigo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.ficha_trimestre || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{horario.docente_nombre}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                            No hay horarios asignados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-sena-primary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Número</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Capacidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Ubicación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salones.map((salon) => (
                      <tr key={salon.id_salon} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{salon.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{salon.numero}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{salon.capacidad}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{salon.ubicacion}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleSelectSalon(salon)}
                            className="px-3 py-1 bg-sena-secondary hover:bg-sena-secondary-dark text-white rounded text-xs"
                          >
                            Ver Horarios
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
