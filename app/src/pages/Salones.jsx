import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useAuth';
import { salonesService } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Salones = () => {
  const { canEdit, canDelete, canCreate } = useRole();
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSalon, setEditingSalon] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', numero: '', capacidad: 30, ubicacion: '' });

  useEffect(() => { loadSalones(); }, []);

  const loadSalones = async () => {
    try {
      const data = await salonesService.getAll();
      setSalones(data.data);
    } catch (error) {
      console.error('Error loading salones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSalon(null);
    setFormData({ nombre: '', numero: '', capacidad: 30, ubicacion: '' });
    setShowModal(true);
  };

  const handleEdit = (salon) => {
    setEditingSalon(salon);
    setFormData({ nombre: salon.nombre, numero: salon.numero || '', capacidad: salon.capacidad, ubicacion: salon.ubicacion || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSalon) {
        await salonesService.update(editingSalon.id_salon, formData);
      } else {
        await salonesService.create(formData);
      }
      setShowModal(false);
      loadSalones();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este salón?')) {
      try {
        await salonesService.delete(id);
        loadSalones();
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
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Salones</h1>
            <p className="text-gray-600 mt-1">Administra los espacios de formación</p>
          </div>
          {canCreate() && (
            <button onClick={handleCreate} className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo Salón</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salones.map((salon) => (
          <div key={salon.id_salon} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-sena-primary">{salon.nombre}</h3>
                {salon.numero && <p className="text-sm text-gray-500">Número: {salon.numero}</p>}
              </div>
              <div className="flex space-x-2">
                {canEdit() && <button onClick={() => handleEdit(salon)} className="text-sena-secondary hover:text-sena-secondary-dark"><PencilIcon className="w-5 h-5" /></button>}
                {canDelete() && <button onClick={() => handleDelete(salon.id_salon)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Capacidad:</span> {salon.capacidad} estudiantes</p>
              {salon.ubicacion && <p><span className="font-medium">Ubicación:</span> {salon.ubicacion}</p>}
              <p><span className="font-medium">Horarios asignados:</span> <span className="text-sena-secondary font-semibold">{salon.total_horarios}</span></p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">{editingSalon ? 'Editar Salón' : 'Nuevo Salón'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input type="text" value={formData.numero} onChange={(e) => setFormData({...formData, numero: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <input type="number" value={formData.capacidad} onChange={(e) => setFormData({...formData, capacidad: parseInt(e.target.value)})} min="1" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input type="text" value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">{editingSalon ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salones;