import React, { useState, useEffect } from 'react';
import { useRole, useAuth } from '../hooks/useAuth';
import { horariosService, docentesService, fichasService, salonesService, competenciasService } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Horarios = () => {
  const { canEdit, canDelete, canCreate, isDocente } = useRole();
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [salones, setSalones] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [formData, setFormData] = useState({ dia: 'lunes', hora_inicio: '', hora_fin: '', id_docente: '', id_ficha: '', id_salon: '', id_competencia: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [horariosData, docentesData, fichasData, salonesData, competenciasData] = await Promise.all([
        isDocente() ? horariosService.getByDocente(user.id_docente) : horariosService.getAll(),
        docentesService.getAll(),
        fichasService.getAll(),
        salonesService.getAll(),
        competenciasService.getAll()
      ]);
      setHorarios(horariosData.data);
      setDocentes(docentesData.data);
      setFichas(fichasData.data);
      setSalones(salonesData.data);
      setCompetencias(competenciasData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHorario(null);
    setFormData({ dia: 'lunes', hora_inicio: '', hora_fin: '', id_docente: isDocente() ? user.id_docente : '', id_ficha: '', id_salon: '', id_competencia: '' });
    setShowModal(true);
  };

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setFormData({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      id_docente: horario.id_docente,
      id_ficha: horario.id_ficha,
      id_salon: horario.id_salon,
      id_competencia: horario.id_competencia
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHorario) {
        await horariosService.update(editingHorario.id_horario, formData);
      } else {
        await horariosService.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este horario?')) {
      try {
        await horariosService.delete(id);
        loadData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Horarios</h1>
            <p className="text-gray-600 mt-1">{isDocente() ? 'Consulta tu horario de clases' : 'Administra la programación de horarios'}</p>
          </div>
          {canCreate() && (
            <button onClick={handleCreate} className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo Horario</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sena-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Día</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Docente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ficha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Salón</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Competencia</th>
              {!isDocente() && <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {horarios.map((horario) => (
              <tr key={horario.id_horario} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{horario.dia}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{horario.hora_inicio} - {horario.hora_fin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{horario.docente_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{horario.ficha_codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{horario.salon_nombre} {horario.salon_numero}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{horario.competencia_nombre}</td>
                {!isDocente() && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {canEdit() && <button onClick={() => handleEdit(horario)} className="text-sena-secondary hover:text-sena-secondary-dark"><PencilIcon className="w-5 h-5" /></button>}
                    {canDelete() && <button onClick={() => handleDelete(horario.id_horario)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">{editingHorario ? 'Editar Horario' : 'Nuevo Horario'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                  <select value={formData.dia} onChange={(e) => setFormData({...formData, dia: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                    {dias.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                  <input type="time" value={formData.hora_inicio} onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                  <input type="time" value={formData.hora_fin} onChange={(e) => setFormData({...formData, hora_fin: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
                </div>
                {!isDocente() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                    <select value={formData.id_docente} onChange={(e) => setFormData({...formData, id_docente: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                      <option value="">Seleccionar docente</option>
                      {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre_apellido}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ficha</label>
                  <select value={formData.id_ficha} onChange={(e) => setFormData({...formData, id_ficha: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                    <option value="">Seleccionar ficha</option>
                    {fichas.map(f => <option key={f.id_ficha} value={f.id_ficha}>{f.codigo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salón</label>
                  <select value={formData.id_salon} onChange={(e) => setFormData({...formData, id_salon: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                    <option value="">Seleccionar salón</option>
                    {salones.map(s => <option key={s.id_salon} value={s.id_salon}>{s.nombre} {s.numero}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competencia</label>
                  <select value={formData.id_competencia} onChange={(e) => setFormData({...formData, id_competencia: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                    <option value="">Seleccionar competencia</option>
                    {competencias.map(c => <option key={c.id_competencia} value={c.id_competencia}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">{editingHorario ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Horarios;