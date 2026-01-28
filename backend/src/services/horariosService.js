const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class HorariosService {
  async getAll(filters = {}) {
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

  async getById(id_horario) {
    try {
      const horarios = await executeProcedure('sp_obtener_horario_por_id', [
        { name: 'id_horario', type: sql.Int, value: id_horario }
      ]);
      
      if (!horarios || horarios.length === 0) {
        return null;
      }
      
      return horarios[0];
    } catch (error) {
      throw new Error(`Error obteniendo horario: ${error.message}`);
    }
  }

  async create(horarioData) {
    try {
      const { dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia } = horarioData;
      
      // Validar datos
      this.validateHorarioData(horarioData);
      
      // Verificar disponibilidad
      await this.checkAvailability(horarioData);
      
      const result = await executeQuery(
        `INSERT INTO horarios (dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia)
         OUTPUT INSERTED.*
         VALUES (@dia, @hora_inicio, @hora_fin, @id_docente, @id_ficha, @id_salon, @id_competencia)`,
        [
          { name: 'dia', type: sql.VarChar, value: dia },
          { name: 'hora_inicio', type: sql.Time, value: hora_inicio },
          { name: 'hora_fin', type: sql.Time, value: hora_fin },
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_ficha', type: sql.Int, value: id_ficha },
          { name: 'id_salon', type: sql.Int, value: id_salon },
          { name: 'id_competencia', type: sql.Int, value: id_competencia }
        ]
      );
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creando horario: ${error.message}`);
    }
  }

  async update(id_horario, horarioData) {
    try {
      const { dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia } = horarioData;
      
      // Validar datos
      this.validateHorarioData(horarioData);
      
      // Verificar disponibilidad (excluyendo el horario actual)
      await this.checkAvailability({ ...horarioData, id_horario });
      
      const result = await executeQuery(
        `UPDATE horarios 
         SET dia = @dia, 
             hora_inicio = @hora_inicio, 
             hora_fin = @hora_fin, 
             id_docente = @id_docente, 
             id_ficha = @id_ficha, 
             id_salon = @id_salon, 
             id_competencia = @id_competencia
         OUTPUT INSERTED.*
         WHERE id_horario = @id_horario`,
        [
          { name: 'dia', type: sql.VarChar, value: dia },
          { name: 'hora_inicio', type: sql.Time, value: hora_inicio },
          { name: 'hora_fin', type: sql.Time, value: hora_fin },
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_ficha', type: sql.Int, value: id_ficha },
          { name: 'id_salon', type: sql.Int, value: id_salon },
          { name: 'id_competencia', type: sql.Int, value: id_competencia },
          { name: 'id_horario', type: sql.Int, value: id_horario }
        ]
      );
      
      if (!result || result.length === 0) {
        throw new Error('Horario no encontrado');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`Error actualizando horario: ${error.message}`);
    }
  }

  async delete(id_horario) {
    try {
      await executeQuery(
        'UPDATE horarios SET activo = 0 WHERE id_horario = @id_horario',
        [{ name: 'id_horario', type: sql.Int, value: id_horario }]
      );
      
      return { success: true, message: 'Horario eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando horario: ${error.message}`);
    }
  }

  async getByDocente(id_docente) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_docente', [
        { name: 'id_docente', type: sql.Int, value: id_docente }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios del docente: ${error.message}`);
    }
  }

  async getByFicha(id_ficha) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_ficha', [
        { name: 'id_ficha', type: sql.Int, value: id_ficha }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios de la ficha: ${error.message}`);
    }
  }

  async getBySalon(id_salon) {
    try {
      const horarios = await executeProcedure('sp_obtener_horarios_por_salon', [
        { name: 'id_salon', type: sql.Int, value: id_salon }
      ]);
      
      return horarios;
    } catch (error) {
      throw new Error(`Error obteniendo horarios del salón: ${error.message}`);
    }
  }

  async validateHorarioData(data) {
    const { dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia } = data;
    
    // Validar campos requeridos
    if (!dia || !hora_inicio || !hora_fin || !id_docente || !id_ficha || !id_salon || !id_competencia) {
      throw new Error('Todos los campos son obligatorios');
    }
    
    // Validar día
    const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    if (!diasValidos.includes(dia.toLowerCase())) {
      throw new Error('Día inválido. Los días válidos son: lunes, martes, miercoles, jueves, viernes, sabado');
    }
    
    // Validar formato de hora
    const horaInicioRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!horaInicioRegex.test(hora_inicio)) {
      throw new Error('Formato de hora inválido. Use HH:MM:SS');
    }
    
    if (!horaInicioRegex.test(hora_fin)) {
      throw new Error('Formato de hora inválido. Use HH:MM:SS');
    }
    
    // Validar que hora_fin sea mayor que hora_inicio
    if (hora_fin <= hora_inicio) {
      throw new Error('La hora de fin debe ser mayor que la hora de inicio');
    }
    
    // Validar rangos de horario (6:00 AM - 10:00 PM)
    const horaInicioDate = new Date(`2000-01-01T${hora_inicio}`);
    const horaFinDate = new Date(`2000-01-01T${hora_fin}`);
    const minTime = new Date('2000-01-01T06:00:00');
    const maxTime = new Date('2000-01-01T22:00:00');
    
    if (horaInicioDate < minTime || horaFinDate > maxTime) {
      throw new Error('Los horarios deben estar entre 6:00 AM y 10:00 PM');
    }
  }

  async checkAvailability(data) {
    const { id_horario, id_docente, id_salon, id_ficha, dia, hora_inicio, hora_fin } = data;
    
    try {
      // Usar la función de SQL Server para validar cruces
      const result = await executeQuery(
        'SELECT dbo.fn_validar_cruce_horario(@id_horario, @id_docente, @id_salon, @id_ficha, @dia, @hora_inicio, @hora_fin) AS existe_cruce',
        [
          { name: 'id_horario', type: sql.Int, value: id_horario || null },
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_salon', type: sql.Int, value: id_salon },
          { name: 'id_ficha', type: sql.Int, value: id_ficha },
          { name: 'dia', type: sql.VarChar, value: dia },
          { name: 'hora_inicio', type: sql.Time, value: hora_inicio },
          { name: 'hora_fin', type: sql.Time, value: hora_fin }
        ]
      );
      
      if (result[0].existe_cruce) {
        throw new Error('Existe un cruce de horario con el docente, salón o ficha especificados');
      }
    } catch (error) {
      throw new Error(`Error validando disponibilidad: ${error.message}`);
    }
  }

  async getDisponibilidad(data) {
    try {
      const { id_docente, id_salon, id_ficha, dia, hora_inicio, hora_fin } = data;
      
      // Buscar horarios que entren en conflicto
      const conflictos = await executeQuery(
        `SELECT 
          h.id_horario,
          h.dia,
          CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
          CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
          d.nombre_apellido AS docente_nombre,
          f.codigo AS ficha_codigo,
          s.nombre AS salon_nombre,
          c.nombre AS competencia_nombre,
          CASE 
            WHEN h.id_docente = @id_docente THEN 'DOCENTE'
            WHEN h.id_salon = @id_salon THEN 'SALON'
            WHEN h.id_ficha = @id_ficha THEN 'FICHA'
          END AS tipo_conflicto
        FROM horarios h
        INNER JOIN docentes d ON h.id_docente = d.id_docente
        INNER JOIN fichas f ON h.id_ficha = f.id_ficha
        INNER JOIN salones s ON h.id_salon = s.id_salon
        INNER JOIN competencias c ON h.id_competencia = c.id_competencia
        WHERE h.activo = 1
          AND h.dia = @dia
          AND h.id_horario != ISNULL(@id_horario, 0)
          AND ((h.hora_inicio <= @hora_inicio AND h.hora_fin > @hora_inicio) 
               OR (h.hora_inicio < @hora_fin AND h.hora_fin >= @hora_fin)
               OR (@hora_inicio <= h.hora_inicio AND @hora_fin >= h.hora_fin))
          AND (h.id_docente = @id_docente OR h.id_salon = @id_salon OR h.id_ficha = @id_ficha)
        ORDER BY h.hora_inicio`,
        [
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'id_salon', type: sql.Int, value: id_salon },
          { name: 'id_ficha', type: sql.Int, value: id_ficha },
          { name: 'dia', type: sql.VarChar, value: dia },
          { name: 'hora_inicio', type: sql.Time, value: hora_inicio },
          { name: 'hora_fin', type: sql.Time, value: hora_fin },
          { name: 'id_horario', type: sql.Int, value: data.id_horario || null }
        ]
      );
      
      return conflictos;
    } catch (error) {
      throw new Error(`Error obteniendo disponibilidad: ${error.message}`);
    }
  }
}

module.exports = new HorariosService();