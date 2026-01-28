import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useAuth';
import { competenciasService } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Competencias = () => {
  const { canEdit, canDelete, canCreate } = useRole();
  const [competencias, setCompetencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompetencia, setEditingCompetencia] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    duracion_horas: ''
  });

  useEffect(() => {
    loadCompetencias();
  }, []);

  const loadCompetencias = async () => {
    try {
      const data = await competenciasService.getAll();
      setCompetencias(data.data);
    } catch (error) {
      console.error('Error loading competencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCompetencia(null);
    setFormData({ nombre: '', codigo: '', duracion_horas: '' });
    setShowModal(true);
  };

  const handleEdit = (competencia) => {
    setEditingCompetencia(competencia);
    setFormData({
      nombre: competencia.nombre,
      codigo: competencia.codigo,
      duracion_horas: competencia.duracion_horas
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCompetencia) {
        await competenciasService.update(editingCompetencia.id_competencia, formData);
      } else {
        await competenciasService.create(formData);
      }
      setShowModal(false);
      loadCompetencias();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta competencia?')) {
      try {
        await competenciasService.delete(id);
        loadCompetencias();
      } catch (error) {
        alert(error.message);
      }
    }
  };

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
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Competencias</h1>
            <p className="text-gray-600 mt-1">Administra las competencias del programa</p>
          </div>
          {canCreate() && (
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nueva Competencia</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sena-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Duración (horas)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {competencias.map((competencia) => (
              <tr key={competencia.id_competencia} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{competencia.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{competencia.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{competencia.duracion_horas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {canEdit() && (
                    <button onClick={() => handleEdit(competencia)} className="text-sena-secondary hover:text-sena-secondary-dark">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}
                  {canDelete() && (
                    <button onClick={() => handleDelete(competencia.id_competencia)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">
              {editingCompetencia ? 'Editar Competencia' : 'Nueva Competencia'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input type="text" value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (horas)</label>
                <input type="number" value={formData.duracion_horas} onChange={(e) => setFormData({...formData, duracion_horas: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">{editingCompetencia ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competencias;