const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class FichasService {
  async getAll() {
    try {
      const fichas = await executeProcedure('sp_obtener_fichas_completas');
      return fichas;
    } catch (error) {
      throw new Error(`Error obteniendo fichas: ${error.message}`);
    }
  }

  async getById(id_ficha) {
    try {
      const fichas = await executeProcedure('sp_obtener_fichas_completas', [
        { name: 'id_ficha', type: sql.Int, value: id_ficha }
      ]);
      
      if (!fichas || fichas.length === 0) {
        return null;
      }
      
      return fichas[0];
    } catch (error) {
      throw new Error(`Error obteniendo ficha: ${error.message}`);
    }
  }

  async create(fichaData) {
    try {
      const { codigo, id_programa, fecha_inicio, fecha_fin, trimestre } = fichaData;
      
      // Verificar si el código ya existe
      const existing = await executeQuery(
        'SELECT id_ficha FROM fichas WHERE codigo = @codigo',
        [{ name: 'codigo', type: sql.VarChar, value: codigo }]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe una ficha con este código');
      }
      
      // Verificar si el programa existe
      const programa = await executeQuery(
        'SELECT id_programa FROM programas WHERE id_programa = @id_programa AND activo = 1',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      if (!programa || programa.length === 0) {
        throw new Error('El programa especificado no existe');
      }
      
      const result = await executeQuery(
        `INSERT INTO fichas (codigo, id_programa, fecha_inicio, fecha_fin, trimestre)
         OUTPUT INSERTED.*
         VALUES (@codigo, @id_programa, @fecha_inicio, @fecha_fin, @trimestre)`,
        [
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'id_programa', type: sql.Int, value: id_programa },
          { name: 'fecha_inicio', type: sql.Date, value: fecha_inicio || null },
          { name: 'fecha_fin', type: sql.Date, value: fecha_fin || null },
          { name: 'trimestre', type: sql.Int, value: trimestre || null }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando ficha: ${error.message}`);
    }
  }

  async update(id_ficha, fichaData) {
    try {
      const { codigo, id_programa, fecha_inicio, fecha_fin, activo } = fichaData;
      
      // Verificar si el código ya existe (excluyendo el actual)
      const existing = await executeQuery(
        'SELECT id_ficha FROM fichas WHERE codigo = @codigo AND id_ficha != @id_ficha',
        [
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'id_ficha', type: sql.Int, value: id_ficha }
        ]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe una ficha con este código');
      }
      
      // Verificar si el programa existe
      const programa = await executeQuery(
        'SELECT id_programa FROM programas WHERE id_programa = @id_programa AND activo = 1',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      if (!programa || programa.length === 0) {
        throw new Error('El programa especificado no existe');
      }
      
      const result = await executeQuery(
        `UPDATE fichas 
         SET codigo = @codigo, id_programa = @id_programa, 
             fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin, trimestre = @trimestre
         OUTPUT INSERTED.*
         WHERE id_ficha = @id_ficha`,
        [
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'id_programa', type: sql.Int, value: id_programa },
          { name: 'fecha_inicio', type: sql.Date, value: fecha_inicio || null },
          { name: 'fecha_fin', type: sql.Date, value: fecha_fin || null },
          { name: 'trimestre', type: sql.Int, value: fichaData.trimestre || null },
          { name: 'id_ficha', type: sql.Int, value: id_ficha }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Ficha no encontrada');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando ficha: ${error.message}`);
    }
  }

  async delete(id_ficha) {
    try {
      // Verificar si tiene horarios activos
      const horarios = await executeQuery(
        'SELECT COUNT(*) AS total FROM horarios WHERE id_ficha = @id_ficha AND activo = 1',
        [{ name: 'id_ficha', type: sql.Int, value: id_ficha }]
      );
      
      if (horarios[0].total > 0) {
        throw new Error('No se puede eliminar la ficha porque tiene horarios asignados');
      }
      
      await executeQuery(
        'UPDATE fichas SET activo = 0 WHERE id_ficha = @id_ficha',
        [{ name: 'id_ficha', type: sql.Int, value: id_ficha }]
      );
      
      return { success: true, message: 'Ficha eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando ficha: ${error.message}`);
    }
  }

  async search(termino) {
    try {
      const fichas = await executeQuery(
        `SELECT 
          f.id_ficha,
          f.codigo,
          f.id_programa,
          p.nombre AS programa_nombre,
          p.codigo AS programa_codigo,
          p.tipo AS programa_tipo,
          f.fecha_inicio,
          f.fecha_fin,
          f.activo,
          COUNT(h.id_horario) AS total_horarios
        FROM fichas f
        INNER JOIN programas p ON f.id_programa = p.id_programa
        LEFT JOIN horarios h ON f.id_ficha = h.id_ficha AND h.activo = 1
        WHERE f.activo = 1
          AND f.codigo LIKE '%' + @termino + '%'
        GROUP BY f.id_ficha, f.codigo, f.id_programa, p.nombre, p.codigo, 
                 p.tipo, f.fecha_inicio, f.fecha_fin, f.activo
        ORDER BY f.codigo`,
        [{ name: 'termino', type: sql.VarChar, value: termino }]
      );
      
      return fichas;
    } catch (error) {
      throw new Error(`Error buscando fichas: ${error.message}`);
    }
  }

  async getHorarios(id_ficha) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_ficha', [
        { name: 'id_ficha', type: sql.Int, value: id_ficha }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios de la ficha: ${error.message}`);
    }
  }
}

module.exports = new FichasService();