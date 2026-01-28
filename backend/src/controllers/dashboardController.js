const dashboardService = require('../services/dashboardService');

class DashboardController {
  // Obtener estadísticas según el rol del usuario
  async getStats(req, res) {
    try {
      const { rol, id_docente } = req.user;
      let stats;

      switch (rol) {
        case 'admin':
          stats = await dashboardService.getStatsAdmin();
          break;
        case 'coordinador':
          stats = await dashboardService.getStatsCoordinador();
          break;
        case 'docente':
          stats = await dashboardService.getStatsDocente(id_docente);
          break;
        default:
          return res.status(403).json({
            success: false,
            message: 'Rol no válido'
          });
      }

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Búsqueda general
  async search(req, res) {
    try {
      const { termino, tipo } = req.query;

      if (!termino) {
        return res.status(400).json({
          success: false,
          message: 'El término de búsqueda es requerido'
        });
      }

      const results = await dashboardService.search(termino, tipo);

      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener horarios con filtros
  async getHorarios(req, res) {
    try {
      const filters = {
        id_docente: req.query.id_docente,
        id_ficha: req.query.id_ficha,
        id_salon: req.query.id_salon,
        dia: req.query.dia
      };

      // Si es docente, solo puede ver sus propios horarios
      if (req.user.rol === 'docente') {
        filters.id_docente = req.user.id_docente;
      }

      const horarios = await dashboardService.getHorariosByFilters(filters);

      return res.status(200).json({
        success: true,
        count: horarios.length,
        data: horarios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();