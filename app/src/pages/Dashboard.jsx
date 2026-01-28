import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardAdmin from '../components/dashboard/DashboardAdmin';
import DashboardCoordinador from '../components/dashboard/DashboardCoordinador';
import DashboardDocente from '../components/dashboard/DashboardDocente';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.rol) {
      case 'admin':
        return <DashboardAdmin />;
      case 'coordinador':
        return <DashboardCoordinador />;
      case 'docente':
        return <DashboardDocente />;
      default:
        return <div>Rol no válido</div>;
    }
  };

  return (
    <div className="p-6">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;