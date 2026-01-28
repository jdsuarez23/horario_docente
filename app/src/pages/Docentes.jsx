import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useAuth';
import { docentesService } from '../services/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Docentes = () => {
  const { canEdit, canDelete, canCreate } = useRole();
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocente, setEditingDocente] = useState(null);
  const [formData, setFormData] = useState({
    nombre_apellido: '',
    numero_documento: '',
    celular: '',
    correo: ''
  });

  useEffect(() => {
    loadDocentes();
  }, []);

  const loadDocentes = async () => {
    try {
      const data = await docentesService.getAll();
      setDocentes(data.data);
    } catch (error) {
      console.error('Error loading docentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDocentes();
      return;
    }
    
    try {
      const data = await docentesService.search(searchTerm);
      setDocentes(data.data);
    } catch (error) {
      console.error('Error searching docentes:', error);
    }
  };

  const handleCreate = () => {
    setEditingDocente(null);
    setFormData({
      nombre_apellido: '',
      numero_documento: '',
      celular: '',
      correo: ''
    });
    setShowModal(true);
  };

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setFormData({
      nombre_apellido: docente.nombre_apellido,
      numero_documento: docente.numero_documento,
      celular: docente.celular || '',
      correo: docente.correo || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingDocente) {
        await docentesService.update(editingDocente.id_docente, formData);
      } else {
        await docentesService.create(formData);
      }
      setShowModal(false);
      loadDocentes();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este docente?')) {
      try {
        await docentesService.delete(id);
        loadDocentes();
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Docentes</h1>
            <p className="text-gray-600 mt-1">Administra los instructores del SENA</p>
          </div>
          
          {canCreate() && (
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo Docente</span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-sena-primary hover:bg-sena-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sena-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Horarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {docentes.map((docente) => (
                <tr key={docente.id_docente} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-sena-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {docente.nombre_apellido.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{docente.nombre_apellido}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {docente.numero_documento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{docente.celular || '-'}</div>
                    <div className="text-sm text-gray-500">{docente.correo || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {docente.total_horarios} horarios
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(docente)}
                      className="text-sena-secondary hover:text-sena-secondary-dark"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(docente.id_docente)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">
              {editingDocente ? 'Editar Docente' : 'Nuevo Docente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre_apellido}
                  onChange={(e) => setFormData({...formData, nombre_apellido: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
                <input
                  type="text"
                  value={formData.numero_documento}
                  onChange={(e) => setFormData({...formData, numero_documento: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg"
                >
                  {editingDocente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docentes;