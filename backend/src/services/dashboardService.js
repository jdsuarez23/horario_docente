const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class DashboardService {
  async getStatsAdmin() {
    try {
      const stats = await executeProcedure('sp_obtener_dashboard_admin');
      
      // El procedimiento retorna múltiples resultados
      const result = {
        generales: stats[0] || {},
        horariosPorDia: stats[1] || [],
        salonesMasOcupados: stats[2] || [],
        docentesConMasHorarios: stats[3] || []
      };
      
      return result;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  async getStatsCoordinador() {
    try {
      // Coordinador ve estadísticas limitadas
      const stats = await executeQuery(
        `SELECT 
          (SELECT COUNT(*) FROM docentes WHERE activo = 1) AS total_docentes,
          (SELECT COUNT(*) FROM fichas WHERE activo = 1) AS total_fichas,
          (SELECT COUNT(*) FROM salones WHERE activo = 1) AS total_salones,
          (SELECT COUNT(*) FROM horarios WHERE activo = 1) AS total_horarios
        `);
      
      const horariosPorDia = await executeQuery(
        `SELECT 
          dia,
          COUNT(*) AS total_horarios
        FROM horarios 
        WHERE activo = 1
        GROUP BY dia
        ORDER BY 
          CASE dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
          END`
      );
      
      return {
        generales: stats[0] || {},
        horariosPorDia: horariosPorDia || []
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  async getStatsDocente(id_docente) {
    try {
      const stats = await executeQuery(
        `SELECT 
          COUNT(*) AS total_horarios,
          COUNT(DISTINCT id_ficha) AS total_fichas,
          COUNT(DISTINCT id_salon) AS total_salones,
          COUNT(DISTINCT id_competencia) AS total_competencias
        FROM horarios 
        WHERE id_docente = @id_docente AND activo = 1`,
        [{ name: 'id_docente', type: sql.Int, value: id_docente }]
      );
      
      const horariosPorDia = await executeQuery(
        `SELECT 
          dia,
          COUNT(*) AS total_horarios
        FROM horarios 
        WHERE id_docente = @id_docente AND activo = 1
        GROUP BY dia
        ORDER BY 
          CASE dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
          END`,
        [{ name: 'id_docente', type: sql.Int, value: id_docente }]
      );
      
      return {
        generales: stats[0] || {},
        horariosPorDia: horariosPorDia || []
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas del docente: ${error.message}`);
    }
  }

  async search(termino, tipo) {
    try {
      let results = {};
      
      if (tipo === 'docente' || !tipo) {
        const docentes = await executeQuery(
          `SELECT 
            d.id_docente,
            d.nombre_apellido,
            d.numero_documento,
            d.celular,
            d.correo,
            COUNT(h.id_horario) AS total_horarios
          FROM docentes d
          LEFT JOIN horarios h ON d.id_docente = h.id_docente AND h.activo = 1
          WHERE d.activo = 1
            AND (d.nombre_apellido LIKE '%' + @termino + '%'
                 OR d.numero_documento LIKE '%' + @termino + '%')
          GROUP BY d.id_docente, d.nombre_apellido, d.numero_documento, d.celular, d.correo
          ORDER BY d.nombre_apellido`,
          [{ name: 'termino', type: sql.VarChar, value: termino }]
        );
        results.docentes = docentes;
      }
      
      if (tipo === 'ficha' || !tipo) {
        const fichas = await executeQuery(
          `SELECT 
            f.id_ficha,
            f.codigo,
            p.nombre AS programa_nombre,
            COUNT(h.id_horario) AS total_horarios
          FROM fichas f
          INNER JOIN programas p ON f.id_programa = p.id_programa
          LEFT JOIN horarios h ON f.id_ficha = h.id_ficha AND h.activo = 1
          WHERE f.activo = 1
            AND f.codigo LIKE '%' + @termino + '%'
          GROUP BY f.id_ficha, f.codigo, p.nombre
          ORDER BY f.codigo`,
          [{ name: 'termino', type: sql.VarChar, value: termino }]
        );
        results.fichas = fichas;
      }
      
      if (tipo === 'salon' || !tipo) {
        const salones = await executeQuery(
          `SELECT 
            s.id_salon,
            s.nombre,
            s.numero,
            COUNT(h.id_horario) AS total_horarios
          FROM salones s
          LEFT JOIN horarios h ON s.id_salon = h.id_salon AND h.activo = 1
          WHERE s.activo = 1
            AND (s.nombre LIKE '%' + @termino + '%'
                 OR s.numero LIKE '%' + @termino + '%')
          GROUP BY s.id_salon, s.nombre, s.numero
          ORDER BY s.nombre`,
          [{ name: 'termino', type: sql.VarChar, value: termino }]
        );
        results.salones = salones;
      }
      
      return results;
    } catch (error) {
      throw new Error(`Error buscando: ${error.message}`);
    }
  }

  async getHorariosByFilters(filters) {
    try {
      const { id_docente, id_ficha, id_salon, dia } = filters;
      
      const horarios = await executeProcedure('sp_obtener_horarios_completos', [
        { name: 'id_docente', type: sql.Int, value: id_docente || null },
        { name: 'id_ficha', type: sql.Int, value: id_ficha || null },
        { name: 'id_salon', type: sql.Int, value: id_salon || null },
        { name: 'dia', type: sql.VarChar, value: dia || null }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios: ${error.message}`);
    }
  }
}

module.exports = new DashboardService();