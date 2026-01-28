const { executeQuery } = require('../config/database');
const { sql } = require('../config/database');

class CompetenciasService {
  async getAll() {
    try {
      const competencias = await executeQuery(
        `SELECT 
          c.id_competencia,
          c.nombre,
          c.codigo,
          c.duracion_horas,
          c.fecha_registro,
          c.activo,
          COUNT(dc.id_docente) AS total_docentes,
          COUNT(rf.id_ruta) AS total_rutas
        FROM competencias c
        LEFT JOIN docente_competencia dc ON c.id_competencia = dc.id_competencia
        LEFT JOIN ruta_formativa rf ON c.id_competencia = rf.id_competencia
        WHERE c.activo = 1
        GROUP BY c.id_competencia, c.nombre, c.codigo, c.duracion_horas, c.fecha_registro, c.activo
        ORDER BY c.nombre`
      );
      
      return competencias;
    } catch (error) {
      throw new Error(`Error obteniendo competencias: ${error.message}`);
    }
  }

  async getById(id_competencia) {
    try {
      const competencias = await executeQuery(
        'SELECT * FROM competencias WHERE id_competencia = @id_competencia AND activo = 1',
        [{ name: 'id_competencia', type: sql.Int, value: id_competencia }]
      );
      
      if (!competencias || competencias.length === 0) {
        return null;
      }
      
      return competencias[0];
    } catch (error) {
      throw new Error(`Error obteniendo competencia: ${error.message}`);
    }
  }

  async create(competenciaData) {
    try {
      const { nombre, codigo, duracion_horas } = competenciaData;
      
      // Verificar si el código ya existe
      const existing = await executeQuery(
        'SELECT id_competencia FROM competencias WHERE codigo = @codigo',
        [{ name: 'codigo', type: sql.VarChar, value: codigo }]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe una competencia con este código');
      }
      
      const result = await executeQuery(
        `INSERT INTO competencias (nombre, codigo, duracion_horas)
         OUTPUT INSERTED.*
         VALUES (@nombre, @codigo, @duracion_horas)`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'duracion_horas', type: sql.Int, value: duracion_horas || 0 }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando competencia: ${error.message}`);
    }
  }

  async update(id_competencia, competenciaData) {
    try {
      const { nombre, codigo, duracion_horas, activo } = competenciaData;
      
      // Verificar si el código ya existe (excluyendo la actual)
      const existing = await executeQuery(
        'SELECT id_competencia FROM competencias WHERE codigo = @codigo AND id_competencia != @id_competencia',
        [
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'id_competencia', type: sql.Int, value: id_competencia }
        ]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe una competencia con este código');
      }
      
      const result = await executeQuery(
        `UPDATE competencias 
         SET nombre = @nombre, codigo = @codigo, duracion_horas = @duracion_horas, activo = @activo
         OUTPUT INSERTED.*
         WHERE id_competencia = @id_competencia`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'duracion_horas', type: sql.Int, value: duracion_horas || 0 },
          { name: 'activo', type: sql.Bit, value: activo },
          { name: 'id_competencia', type: sql.Int, value: id_competencia }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Competencia no encontrada');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando competencia: ${error.message}`);
    }
  }

  async delete(id_competencia) {
    try {
      // Verificar si tiene horarios activos
      const horarios = await executeQuery(
        'SELECT COUNT(*) AS total FROM horarios WHERE id_competencia = @id_competencia AND activo = 1',
        [{ name: 'id_competencia', type: sql.Int, value: id_competencia }]
      );
      
      if (horarios[0].total > 0) {
        throw new Error('No se puede eliminar la competencia porque tiene horarios asignados');
      }
      
      // Verificar si tiene rutas formativas
      const rutas = await executeQuery(
        'SELECT COUNT(*) AS total FROM ruta_formativa WHERE id_competencia = @id_competencia',
        [{ name: 'id_competencia', type: sql.Int, value: id_competencia }]
      );
      
      if (rutas[0].total > 0) {
        throw new Error('No se puede eliminar la competencia porque está en rutas formativas');
      }
      
      // Verificar si tiene docentes asignados
      const docentes = await executeQuery(
        'SELECT COUNT(*) AS total FROM docente_competencia WHERE id_competencia = @id_competencia',
        [{ name: 'id_competencia', type: sql.Int, value: id_competencia }]
      );
      
      if (docentes[0].total > 0) {
        throw new Error('No se puede eliminar la competencia porque tiene docentes asignados');
      }
      
      await executeQuery(
        'UPDATE competencias SET activo = 0 WHERE id_competencia = @id_competencia',
        [{ name: 'id_competencia', type: sql.Int, value: id_competencia }]
      );
      
      return { success: true, message: 'Competencia eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando competencia: ${error.message}`);
    }
  }

  async getByDocente(id_docente) {
    try {
      const competencias = await executeQuery(
        `SELECT 
          c.id_competencia,
          c.nombre,
          c.codigo,
          c.duracion_horas
        FROM competencias c
        INNER JOIN docente_competencia dc ON c.id_competencia = dc.id_competencia
        WHERE dc.id_docente = @id_docente AND c.activo = 1
        ORDER BY c.nombre`,
        [{ name: 'id_docente', type: sql.Int, value: id_docente }]
      );
      
      return competencias;
    } catch (error) {
      throw new Error(`Error obteniendo competencias del docente: ${error.message}`);
    }
  }
}

module.exports = new CompetenciasService();