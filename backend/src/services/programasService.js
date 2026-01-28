const { executeQuery } = require('../config/database');
const { sql } = require('../config/database');

class ProgramasService {
  async getAll() {
    try {
      const programas = await executeQuery(
        `SELECT 
          p.id_programa,
          p.nombre,
          p.codigo,
          p.tipo,
          p.duracion_trimestres,
          p.tipo_oferta,
          p.fecha_registro,
          p.activo,
          COUNT(f.id_ficha) AS total_fichas
        FROM programas p
        LEFT JOIN fichas f ON p.id_programa = f.id_programa AND f.activo = 1
        WHERE p.activo = 1
        GROUP BY p.id_programa, p.nombre, p.codigo, p.tipo, p.duracion_trimestres, 
                 p.tipo_oferta, p.fecha_registro, p.activo
        ORDER BY p.nombre`
      );
      
      return programas;
    } catch (error) {
      throw new Error(`Error obteniendo programas: ${error.message}`);
    }
  }

  async getById(id_programa) {
    try {
      const programas = await executeQuery(
        'SELECT * FROM programas WHERE id_programa = @id_programa AND activo = 1',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      if (!programas || programas.length === 0) {
        return null;
      }
      
      return programas[0];
    } catch (error) {
      throw new Error(`Error obteniendo programa: ${error.message}`);
    }
  }

  async create(programaData) {
    try {
      const { nombre, codigo, tipo, duracion_trimestres, tipo_oferta } = programaData;
      
      // Verificar si el código ya existe
      const existing = await executeQuery(
        'SELECT id_programa FROM programas WHERE codigo = @codigo',
        [{ name: 'codigo', type: sql.VarChar, value: codigo }]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe un programa con este código');
      }
      
      const result = await executeQuery(
        `INSERT INTO programas (nombre, codigo, tipo, duracion_trimestres, tipo_oferta)
         OUTPUT INSERTED.*
         VALUES (@nombre, @codigo, @tipo, @duracion_trimestres, @tipo_oferta)`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'tipo', type: sql.VarChar, value: tipo },
          { name: 'duracion_trimestres', type: sql.Int, value: duracion_trimestres || 4 },
          { name: 'tipo_oferta', type: sql.VarChar, value: tipo_oferta || 'abierta' }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando programa: ${error.message}`);
    }
  }

  async update(id_programa, programaData) {
    try {
      const { nombre, codigo, tipo, duracion_trimestres, tipo_oferta, activo } = programaData;
      
      // Verificar si el código ya existe (excluyendo el actual)
      const existing = await executeQuery(
        'SELECT id_programa FROM programas WHERE codigo = @codigo AND id_programa != @id_programa',
        [
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'id_programa', type: sql.Int, value: id_programa }
        ]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe un programa con este código');
      }
      
      const result = await executeQuery(
        `UPDATE programas 
         SET nombre = @nombre, codigo = @codigo, tipo = @tipo, 
             duracion_trimestres = @duracion_trimestres, tipo_oferta = @tipo_oferta, activo = @activo
         OUTPUT INSERTED.*
         WHERE id_programa = @id_programa`,
        [
          { name: 'nombre', type: sql.VarChar, value: nombre },
          { name: 'codigo', type: sql.VarChar, value: codigo },
          { name: 'tipo', type: sql.VarChar, value: tipo },
          { name: 'duracion_trimestres', type: sql.Int, value: duracion_trimestres || 4 },
          { name: 'tipo_oferta', type: sql.VarChar, value: tipo_oferta || 'abierta' },
          { name: 'activo', type: sql.Bit, value: activo },
          { name: 'id_programa', type: sql.Int, value: id_programa }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Programa no encontrado');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando programa: ${error.message}`);
    }
  }

  async delete(id_programa) {
    try {
      // Verificar si tiene fichas activas
      const fichas = await executeQuery(
        'SELECT COUNT(*) AS total FROM fichas WHERE id_programa = @id_programa AND activo = 1',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      if (fichas[0].total > 0) {
        throw new Error('No se puede eliminar el programa porque tiene fichas activas');
      }
      
      // Verificar si tiene rutas formativas
      const rutas = await executeQuery(
        'SELECT COUNT(*) AS total FROM ruta_formativa WHERE id_programa = @id_programa',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      if (rutas[0].total > 0) {
        throw new Error('No se puede eliminar el programa porque tiene rutas formativas asociadas');
      }
      
      await executeQuery(
        'UPDATE programas SET activo = 0 WHERE id_programa = @id_programa',
        [{ name: 'id_programa', type: sql.Int, value: id_programa }]
      );
      
      return { success: true, message: 'Programa eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando programa: ${error.message}`);
    }
  }

  async getByTipo(tipo) {
    try {
      const programas = await executeQuery(
        `SELECT * FROM programas 
         WHERE tipo = @tipo AND activo = 1 
         ORDER BY nombre`,
        [{ name: 'tipo', type: sql.VarChar, value: tipo }]
      );
      
      return programas;
    } catch (error) {
      throw new Error(`Error obteniendo programas por tipo: ${error.message}`);
    }
  }
}

module.exports = new ProgramasService();