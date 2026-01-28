import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Docentes from './pages/Docentes';
import Competencias from './pages/Competencias';
import Programas from './pages/Programas';
import Fichas from './pages/Fichas';
import Salones from './pages/Salones';
import Horarios from './pages/Horarios';

// Componente para rutas protegidas
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (solo cuando no está autenticado)
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="docentes" element={<Docentes />} />
              <Route path="competencias" element={<Competencias />} />
              <Route path="programas" element={<Programas />} />
              <Route path="fichas" element={<Fichas />} />
              <Route path="salones" element={<Salones />} />
              <Route path="horarios" element={<Horarios />} />
            </Route>
          </Route>

          {/* Logout */}
          <Route path="/logout" element={<Logout />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente de logout
const Logout: React.FC = () => {
  const { logout } = useAuth();
  React.useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
};

export default App;