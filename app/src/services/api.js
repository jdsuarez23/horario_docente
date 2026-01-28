const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    // Manejo de errores de autenticación
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }
    
    return data;
  }

  // Métodos HTTP
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instancia única
const api = new ApiService();

// Servicios específicos
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  changePassword: (oldPassword, newPassword) => api.put('/auth/change-password', { oldPassword, newPassword }),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
  createUser: (userData) => api.post('/auth/users', userData),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

export const docentesService = {
  getAll: () => api.get('/docentes'),
  getById: (id) => api.get(`/docentes/${id}`),
  create: (data) => api.post('/docentes', data),
  update: (id, data) => api.put(`/docentes/${id}`, data),
  delete: (id) => api.delete(`/docentes/${id}`),
  search: (termino) => api.get(`/docentes/search?termino=${termino}`),
  getHorarios: (id) => api.get(`/docentes/${id}/horarios`),
  assignCompetencia: (id, id_competencia) => api.post(`/docentes/${id}/competencias`, { id_competencia }),
  removeCompetencia: (id, id_competencia) => api.delete(`/docentes/${id}/competencias`, { id_competencia })
};

export const competenciasService = {
  getAll: () => api.get('/competencias'),
  getById: (id) => api.get(`/competencias/${id}`),
  create: (data) => api.post('/competencias', data),
  update: (id, data) => api.put(`/competencias/${id}`, data),
  delete: (id) => api.delete(`/competencias/${id}`),
  getByDocente: (id) => api.get(`/competencias/docente/${id}`)
};

export const programasService = {
  getAll: () => api.get('/programas'),
  getById: (id) => api.get(`/programas/${id}`),
  create: (data) => api.post('/programas', data),
  update: (id, data) => api.put(`/programas/${id}`, data),
  delete: (id) => api.delete(`/programas/${id}`),
  getByTipo: (tipo) => api.get(`/programas/tipo/${tipo}`)
};

export const fichasService = {
  getAll: () => api.get('/fichas'),
  getById: (id) => api.get(`/fichas/${id}`),
  create: (data) => api.post('/fichas', data),
  update: (id, data) => api.put(`/fichas/${id}`, data),
  delete: (id) => api.delete(`/fichas/${id}`),
  search: (termino) => api.get(`/fichas/search?termino=${termino}`),
  getHorarios: (id) => api.get(`/fichas/${id}/horarios`)
};

export const salonesService = {
  getAll: () => api.get('/salones'),
  getById: (id) => api.get(`/salones/${id}`),
  create: (data) => api.post('/salones', data),
  update: (id, data) => api.put(`/salones/${id}`, data),
  delete: (id) => api.delete(`/salones/${id}`),
  getHorarios: (id) => api.get(`/salones/${id}/horarios`)
};

export const horariosService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/horarios?${params}`);
  },
  getById: (id) => api.get(`/horarios/${id}`),
  create: (data) => api.post('/horarios', data),
  update: (id, data) => api.put(`/horarios/${id}`, data),
  delete: (id) => api.delete(`/horarios/${id}`),
  getByDocente: (id) => api.get(`/horarios/docente/${id}`),
  getByFicha: (id) => api.get(`/horarios/ficha/${id}`),
  getBySalon: (id) => api.get(`/horarios/salon/${id}`),
  checkDisponibilidad: (data) => api.post('/horarios/disponibilidad', data)
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  search: (termino, tipo) => api.get(`/dashboard/search?termino=${termino}${tipo ? `&tipo=${tipo}` : ''}`),
  getHorarios: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/dashboard/horarios?${params}`);
  }
};

export default api;