import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

export const useRole = () => {
  const { user } = useAuth();
  
  const isAdmin = () => user?.rol === 'admin';
  const isCoordinador = () => user?.rol === 'coordinador';
  const isDocente = () => user?.rol === 'docente';
  const canEdit = () => isAdmin() || isCoordinador();
  const canCreate = () => isAdmin();
  const canDelete = () => isAdmin();
  
  return {
    isAdmin,
    isCoordinador,
    isDocente,
    canEdit,
    canCreate,
    canDelete
  };
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const get = (url) => apiCall(url, { method: 'GET' });
  const post = (url, data) => apiCall(url, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
  const put = (url, data) => apiCall(url, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });
  const del = (url) => apiCall(url, { method: 'DELETE' });
  
  return { 
    loading, 
    error, 
    get, 
    post, 
    put, 
    del,
    apiCall 
  };
};