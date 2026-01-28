const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class SalonesService {
  async getAll() {
    try {
      const salones = await executeQuery(
        `SELECT 
          s.id_salon,
          s.nombre,
          s.numero,
          s.capacidad,
          s.ubicacion,
          s.fecha_registro,
          s.activo,
          COUNT(h.id_horario) AS total_horarios
        FROM salones s
        LEFT JOIN horarios h ON s.id_salon = h.id_salon AND h.activo = 1
        WHERE s.activo = 1
        GROUP BY s.id_salon, s.nombre, s.numero, s.capacidad, s.ubicacion, s.fecha_registro, s.activo
        ORDER BY s.nombre`
      );
      
      return salones;
    } catch (error) {
      throw new Error(`Error obteniendo salones: ${error.message}`);
    }
  }

  async getById(id_salon) {
    try {
      const salones = await executeQuery(
        'SELECT * FROM salones WHERE id_salon = @id_salon AND activo = 1',
        [{ name: 'id_salon', type: sql.Int, value: id_salon }]
      );
      
      if (!salones || salones.length === 0) {
        return null;
      }
      
      return salones[0];
    } catch (error) {
      throw new Error(`Error obteniendo salón: ${error.message}`);
    }
  }

  async create(salonData) {
    try {
      const { nombre, numero, capacidad, ubicacion } = salonData;
      
      // Verificar si el número ya existe
      if (numero) {
        const existing = await executeQuery(
          'SELECT id_salon FROM salones WHERE numero = @numero',
          [{ name: 'numero', type: sql.VarChar, value: numero }]
        );
        
        if (existing && existing.length > 0) {
          throw new Error('Ya existe un salón con este número');
        }
      }
      
      const result = await executeQuery(
        `INSERT INTO salones (nombre, numero, capacidad, ubicacion)
         OUTPUT INSERTED.*
         VALUES (@nombre, @numero, @capacidad, @ubicacion)`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'numero', type: sql.VarChar, value: numero || null },
          { name: 'capacidad', type: sql.Int, value: capacidad || 30 },
          { name: 'ubicacion', type: sql.VarChar, value: ubicacion || null }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando salón: ${error.message}`);
    }
  }

  async update(id_salon, salonData) {
    try {
      const { nombre, numero, capacidad, ubicacion, activo } = salonData;
      
      // Verificar si el número ya existe (excluyendo el actual)
      if (numero) {
        const existing = await executeQuery(
          'SELECT id_salon FROM salones WHERE numero = @numero AND id_salon != @id_salon',
          [
            { name: 'numero', type: sql.VarChar, value: numero },
            { name: 'id_salon', type: sql.Int, value: id_salon }
          ]
        );
        
        if (existing && existing.length > 0) {
          throw new Error('Ya existe un salón con este número');
        }
      }
      
      const result = await executeQuery(
        `UPDATE salones 
         SET nombre = @nombre, numero = @numero, capacidad = @capacidad, ubicacion = @ubicacion, activo = @activo
         OUTPUT INSERTED.*
         WHERE id_salon = @id_salon`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'numero', type: sql.VarChar, value: numero || null },
          { name: 'capacidad', type: sql.Int, value: capacidad || 30 },
          { name: 'ubicacion', type: sql.VarChar, value: ubicacion || null },
          { name: 'activo', type: sql.Bit, value: activo },
          { name: 'id_salon', type: sql.Int, value: id_salon }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Salón no encontrado');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando salón: ${error.message}`);
    }
  }

  async delete(id_salon) {
    try {
      // Verificar si tiene horarios activos
      const horarios = await executeQuery(
        'SELECT COUNT(*) AS total FROM horarios WHERE id_salon = @id_salon AND activo = 1',
        [{ name: 'id_salon', type: sql.Int, value: id_salon }]
      );
      
      if (horarios[0].total > 0) {
        throw new Error('No se puede eliminar el salón porque tiene horarios asignados');
      }
      
      await executeQuery(
        'UPDATE salones SET activo = 0 WHERE id_salon = @id_salon',
        [{ name: 'id_salon', type: sql.Int, value: id_salon }]
      );
      
      return { success: true, message: 'Salón eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando salón: ${error.message}`);
    }
  }

  async getHorarios(id_salon) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_salon', [
        { name: 'id_salon', type: sql.Int, value: id_salon }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios del salón: ${error.message}`);
    }
  }
}

module.exports = new SalonesService();