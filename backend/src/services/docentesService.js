const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class DocentesService {
  // Obtener todos los docentes
  async getAll() {
    try {
      const docentes = await executeProcedure('sp_obtener_docentes_con_competencias');
      
      // Agrupar competencias por docente
      const docentesMap = new Map();
      
      docentes.forEach(row => {
        if (!docentesMap.has(row.id_docente)) {
          docentesMap.set(row.id_docente, {
            id_docente: row.id_docente,
            nombre_apellido: row.nombre_apellido,
            numero_documento: row.numero_documento,
            celular: row.celular,
            correo: row.correo,
            fecha_registro: row.fecha_registro,
            activo: row.activo,
            total_horarios: row.total_horarios || 0,
            competencias: []
          });
        }
        
        if (row.id_competencia) {
          docentesMap.get(row.id_docente).competencias.push({
            id_competencia: row.id_competencia,
            nombre: row.competencia_nombre,
            codigo: row.competencia_codigo,
            duracion_horas: row.duracion_horas,
            fecha_asignacion: row.fecha_asignacion
          });
        }
      });
      
      return Array.from(docentesMap.values());
    } catch (error) {
      throw new Error(`Error obteniendo docentes: ${error.message}`);
    }
  }

  // Obtener docente por ID
  async getById(id_docente) {
    try {
      const docentes = await executeProcedure('sp_obtener_docentes_con_competencias', [
        { name: 'id_docente', type: sql.Int, value: id_docente }
      ]);
      
      if (!docentes || docentes.length === 0) {
        return null;
      }
      
      // Agrupar competencias
      const docente = {
        id_docente: docentes[0].id_docente,
        nombre_apellido: docentes[0].nombre_apellido,
        numero_documento: docentes[0].numero_documento,
        celular: docentes[0].celular,
        correo: docentes[0].correo,
        fecha_registro: docentes[0].fecha_registro,
        activo: docentes[0].activo,
        total_horarios: docentes[0].total_horarios || 0,
        competencias: []
      };
      
      docentes.forEach(row => {
        if (row.id_competencia) {
          docente.competencias.push({
            id_competencia: row.id_competencia,
            nombre: row.competencia_nombre,
            codigo: row.competencia_codigo,
            duracion_horas: row.duracion_horas,
            fecha_asignacion: row.fecha_asignacion
          });
        }
      });
      
      return docente;
    } catch (error) {
      throw new Error(`Error obteniendo docente: ${error.message}`);
    }
  }

  // Crear docente
  async create(docenteData) {
    try {
      const { nombre_apellido, numero_documento, celular, correo } = docenteData;
      
      // Verificar si el documento ya existe
      const existing = await executeQuery(
        'SELECT id_docente FROM docentes WHERE numero_documento = @numero_documento AND activo = 1',
        [{ name: 'numero_documento', type: sql.VarChar, value: numero_documento }]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe un docente con este número de documento');
      }
      
      // Verificar si el correo ya existe
      if (correo) {
        const existingEmail = await executeQuery(
          'SELECT id_docente FROM docentes WHERE correo = @correo AND activo = 1',
          [{ name: 'correo', type: sql.VarChar, value: correo }]
        );
        
        if (existingEmail && existingEmail.length > 0) {
          throw new Error('Ya existe un docente con este correo electrónico');
        }
      }
      
      const result = await executeQuery(
        `INSERT INTO docentes (nombre_apellido, numero_documento, celular, correo)
         OUTPUT INSERTED.*
         VALUES (@nombre_apellido, @numero_documento, @celular, @correo)`,
        [
          { name: 'nombre_apellido', type: sql.VarChar, value: nombre_apellido },
          { name: 'numero_documento', type: sql.VarChar, value: numero_documento },
          { name: 'celular', type: sql.VarChar, value: celular || null },
          { name: 'correo', type: sql.VarChar, value: correo || null }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando docente: ${error.message}`);
    }
  }

  // Actualizar docente
  async update(id_docente, docenteData) {
    try {
      const { nombre_apellido, numero_documento, celular, correo, activo } = docenteData;
      
      // Verificar si el documento ya existe (excluyendo el actual)
      const existing = await executeQuery(
        'SELECT id_docente FROM docentes WHERE numero_documento = @numero_documento AND id_docente != @id_docente AND activo = 1',
        [
          { name: 'numero_documento', type: sql.VarChar, value: numero_documento },
          { name: 'id_docente', type: sql.Int, value: id_docente }
        ]
      );
      
      if (existing && existing.length > 0) {
        throw new Error('Ya existe un docente con este número de documento');
      }
      
      // Verificar si el correo ya existe (excluyendo el actual)
      if (correo) {
        const existingEmail = await executeQuery(
          'SELECT id_docente FROM docentes WHERE correo = @correo AND id_docente != @id_docente AND activo = 1',
          [
            { name: 'correo', type: sql.VarChar, value: correo },
            { name: 'id_docente', type: sql.Int, value: id_docente }
          ]
        );
        
        if (existingEmail && existingEmail.length > 0) {
          throw new Error('Ya existe un docente con este correo electrónico');
        }
      }
      
      const result = await executeQuery(
        `UPDATE docentes 
         SET nombre_apellido = @nombre_apellido, 
             numero_documento = @numero_documento, 
             celular = @celular, 
             correo = @correo,
             activo = @activo
         OUTPUT INSERTED.*
         WHERE id_docente = @id_docente`,
        [
          { name: 'nombre_apellido', type: sql.VarChar, value: nombre_apellido },
          { name: 'numero_documento', type: sql.VarChar, value: numero_documento },
          { name: 'celular', type: sql.VarChar, value: celular || null },
          { name: 'correo', type: sql.VarChar, value: correo || null },
          { name: 'activo', type: sql.Bit, value: activo },
          { name: 'id_docente', type: sql.Int, value: id_docente }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Docente no encontrado');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando docente: ${error.message}`);
    }
  }

  // Eliminar docente (soft delete)
  async delete(id_docente) {
    try {
      // Verificar si tiene horarios activos
      const horarios = await executeQuery(
        'SELECT COUNT(*) AS total FROM horarios WHERE id_docente = @id_docente AND activo = 1',
        [{ name: 'id_docente', type: sql.Int, value: id_docente }]
      );
      
      if (horarios[0].total > 0) {
        throw new Error('No se puede eliminar el docente porque tiene horarios asignados');
      }
      
      await executeQuery(
        'UPDATE docentes SET activo = 0 WHERE id_docente = @id_docente',
        [{ name: 'id_docente', type: sql.Int, value: id_docente }]
      );
      
      return { success: true, message: 'Docente eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando docente: ${error.message}`);
    }
  }

  // Buscar docentes
  async search(termino) {
    try {
      const docentes = await executeQuery(
        `SELECT 
          d.id_docente,
          d.nombre_apellido,
          d.numero_documento,
          d.celular,
          d.correo,
          d.fecha_registro,
          d.activo,
          COUNT(h.id_horario) AS total_horarios
        FROM docentes d
        LEFT JOIN horarios h ON d.id_docente = h.id_docente AND h.activo = 1
        WHERE d.activo = 1
          AND (d.nombre_apellido LIKE '%' + @termino + '%'
               OR d.numero_documento LIKE '%' + @termino + '%'
               OR d.correo LIKE '%' + @termino + '%')
        GROUP BY d.id_docente, d.nombre_apellido, d.numero_documento, 
                 d.celular, d.correo, d.fecha_registro, d.activo
        ORDER BY d.nombre_apellido`,
        [{ name: 'termino', type: sql.VarChar, value: termino }]
      );
      
      return docentes;
    } catch (error) {
      throw new Error(`Error buscando docentes: ${error.message}`);
    }
  }

  // Obtener horarios de un docente
  async getHorarios(id_docente) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_docente', [
        { name: 'id_docente', type: sql.Int, value: id_docente }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios del docente: ${error.message}`);
    }
  }

  // Asignar competencia a docente
  async assignCompetencia(id_docente, id_competencia) {
    try {
      await executeQuery(
        'INSERT INTO docente_competencia (id_docente, id_competencia) VALUES (@id_docente, @id_competencia)',
        [
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_competencia', type: sql.Int, value: id_competencia }
        ]
      );
      
      return { success: true, message: 'Competencia asignada correctamente' };
    } catch (error) {
      throw new Error(`Error asignando competencia: ${error.message}`);
    }
  }

  // Remover competencia de docente
  async removeCompetencia(id_docente, id_competencia) {
    try {
      await executeQuery(
        'DELETE FROM docente_competencia WHERE id_docente = @id_docente AND id_competencia = @id_competencia',
        [
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_competencia', type: sql.Int, value: id_competencia }
        ]
      );
      
      return { success: true, message: 'Competencia removida correctamente' };
    } catch (error) {
      throw new Error(`Error removiendo competencia: ${error.message}`);
    }
  }
}

module.exports = new DocentesService();