import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useAuth';
import { fichasService, programasService } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Fichas = () => {
  const { canEdit, canDelete, canCreate } = useRole();
  const [fichas, setFichas] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFicha, setEditingFicha] = useState(null);
  const [formData, setFormData] = useState({ codigo: '', id_programa: '', trimestre: '', fecha_inicio: '', fecha_fin: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [fichasData, programasData] = await Promise.all([fichasService.getAll(), programasService.getAll()]);
      setFichas(fichasData.data);
      setProgramas(programasData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFicha(null);
    setFormData({ codigo: '', id_programa: '', trimestre: '', fecha_inicio: '', fecha_fin: '' });
    setShowModal(true);
  };

  const handleEdit = (ficha) => {
    setEditingFicha(ficha);
    setFormData({
      codigo: ficha.codigo,
      id_programa: ficha.id_programa,
      trimestre: ficha.trimestre || '',
      fecha_inicio: ficha.fecha_inicio ? ficha.fecha_inicio.split('T')[0] : '',
      fecha_fin: ficha.fecha_fin ? ficha.fecha_fin.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        codigo: formData.codigo,
        id_programa: parseInt(formData.id_programa),
        trimestre: formData.trimestre ? parseInt(formData.trimestre) : null,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin: formData.fecha_fin || null
      };
      if (editingFicha) {
        await fichasService.update(editingFicha.id_ficha, dataToSubmit);
      } else {
        await fichasService.create(dataToSubmit);
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta ficha?')) {
      try {
        await fichasService.delete(id);
        await loadData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) { loadData(); return; }
    try {
      const data = await fichasService.search(searchTerm);
      setFichas(data.data);
    } catch (error) {
      console.error('Error searching fichas:', error);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-sena-primary">Gestión de Fichas</h1>
            <p className="text-gray-600 mt-1">Administra los grupos de formación</p>
          </div>
          {canCreate() && (
            <button onClick={handleCreate} className="flex items-center space-x-2 bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">
              <PlusIcon className="w-5 h-5" />
              <span>Nueva Ficha</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Buscar por código de ficha..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
          </div>
          <button onClick={handleSearch} className="bg-sena-primary hover:bg-sena-primary-dark text-white px-6 py-2 rounded-lg">Buscar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sena-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Programa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trimestre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Horarios</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fichas.map((ficha) => (
              <tr key={ficha.id_ficha} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ficha.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ficha.programa_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ficha.trimestre || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ficha.fecha_inicio ? new Date(ficha.fecha_inicio).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ficha.fecha_fin ? new Date(ficha.fecha_fin).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{ficha.total_horarios} horarios</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {canEdit() && <button onClick={() => handleEdit(ficha)} className="text-sena-secondary hover:text-sena-secondary-dark"><PencilIcon className="w-5 h-5" /></button>}
                  {canDelete() && <button onClick={() => handleDelete(ficha.id_ficha)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-sena-primary mb-4">{editingFicha ? 'Editar Ficha' : 'Nueva Ficha'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input type="text" value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                <select value={formData.id_programa} onChange={(e) => setFormData({...formData, id_programa: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                  <option value="">Seleccionar programa</option>
                  {programas.map(p => <option key={p.id_programa} value={p.id_programa}>{p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
                <select value={formData.trimestre} onChange={(e) => setFormData({...formData, trimestre: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary">
                  <option value="">Seleccionar trimestre</option>
                  {[1, 2, 3, 4, 5, 6].map(t => <option key={t} value={t}>Trimestre {t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" value={formData.fecha_fin} onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-secondary" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="bg-sena-secondary hover:bg-sena-secondary-dark text-white px-4 py-2 rounded-lg">{editingFicha ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fichas;