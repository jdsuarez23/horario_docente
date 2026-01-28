import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useAuth';
import { programasService } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Programas = () => {
  const { canEdit, canDelete, canCreate } = useRole();
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', codigo: '', tipo: 'tecnico', duracion_trimestres: 4, tipo_oferta: 'abierta' });

  useEffect(() => { loadProgramas(); }, []);

  const loadProgramas = async () => {
    try {
      const data = await programasService.getAll();
      setProgramas(data.data);
    } catch (error) {
      console.error('Error loading programas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPrograma(null);
    setFormData({ nombre: '', codigo: '', tipo: 'tecnico', duracion_trimestres: 4, tipo_oferta: 'abierta' });
    setShowModal(true);
  };

  const handleEdit = (programa) => {
    setEditingPrograma(programa);
    setFormData({ nombre: programa.nombre, codigo: programa.codigo, tipo: programa.tipo, duracion_trimestres: programa.duracion_trimestres, tipo_oferta: programa.tipo_oferta });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPrograma) {
        await programasService.update(editingPrograma.id_programa, formData);
      } else {
        await programasService.create(formData);
      }
      setShowModal(false);
      loadProgramas();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este programa?')) {
      try {
        await programasService.delete(id);
        loadProgramas();
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
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Programas</h1>
            <p className="text-gray-600 mt-1">Administra los programas de formación</p>
          </div>
          {canCreate() && (
            <button onClick={handleCreate} className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo Programa</span>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Duración</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fichas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programas.map((programa) => (
              <tr key={programa.id_programa} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{programa.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{programa.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">{programa.tipo}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{programa.duracion_trimestres} trimestres</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{programa.total_fichas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {canEdit() && <button onClick={() => handleEdit(programa)} className="text-sena-secondary hover:text-sena-secondary-dark"><PencilIcon className="w-5 h-5" /></button>}
                  {canDelete() && <button onClick={() => handleDelete(programa.id_programa)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">{editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                  <option value="tecnico">Técnico</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="asistente">Asistente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (trimestres)</label>
                <input type="number" value={formData.duracion_trimestres} onChange={(e) => setFormData({...formData, duracion_trimestres: e.target.value})} min="1" max="12" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Oferta</label>
                <select value={formData.tipo_oferta} onChange={(e) => setFormData({...formData, tipo_oferta: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                  <option value="abierta">Abierta</option>
                  <option value="cerrada">Cerrada</option>
                  <option value="encadenamiento">Encadenamiento</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">{editingPrograma ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programas;