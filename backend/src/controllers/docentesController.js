const docentesService = require('../services/docentesService');
const Joi = require('joi');

// Esquema de validación para docentes
const docenteSchema = Joi.object({
  nombre_apellido: Joi.string().min(3).max(100).required().messages({
    'any.required': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),
  numero_documento: Joi.string().min(5).max(20).required().messages({
    'any.required': 'El número de documento es requerido',
    'string.min': 'El documento debe tener al menos 5 caracteres',
    'string.max': 'El documento no puede exceder 20 caracteres'
  }),
  celular: Joi.string().max(20).allow('').messages({
    'string.max': 'El celular no puede exceder 20 caracteres'
  }),
  correo: Joi.string().email().max(100).allow('').messages({
    'string.email': 'El correo debe ser válido',
    'string.max': 'El correo no puede exceder 100 caracteres'
  }),
  activo: Joi.boolean()
});

class DocentesController {
  // Obtener todos los docentes
  async getAll(req, res) {
    try {
      const docentes = await docentesService.getAll();

      return res.status(200).json({
        success: true,
        count: docentes.length,
        data: docentes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener docente por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const docente = await docentesService.getById(parseInt(id));

      if (!docente) {
        return res.status(404).json({
          success: false,
          message: 'Docente no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: docente
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Crear docente
  async create(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = docenteSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const docente = await docentesService.create(value);

      return res.status(201).json({
        success: true,
        message: 'Docente creado correctamente',
        data: docente
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Actualizar docente
  async update(req, res) {
    try {
      const { id } = req.params;
      
      // Validar datos de entrada
      const { error, value } = docenteSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const docente = await docentesService.update(parseInt(id), value);

      return res.status(200).json({
        success: true,
        message: 'Docente actualizado correctamente',
        data: docente
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Eliminar docente
  async delete(req, res) {
    try {
      const { id } = req.params;

      await docentesService.delete(parseInt(id));

      return res.status(200).json({
        success: true,
        message: 'Docente eliminado correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar docentes
  async search(req, res) {
    try {
      const { termino } = req.query;

      if (!termino) {
        return res.status(400).json({
          success: false,
          message: 'El término de búsqueda es requerido'
        });
      }

      const docentes = await docentesService.search(termino);

      return res.status(200).json({
        success: true,
        count: docentes.length,
        data: docentes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener horarios de un docente
  async getHorarios(req, res) {
    try {
      const { id } = req.params;

      const horarios = await docentesService.getHorarios(parseInt(id));

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

  // Asignar competencia a docente
  async assignCompetencia(req, res) {
    try {
      const { id } = req.params;
      const { id_competencia } = req.body;

      if (!id_competencia) {
        return res.status(400).json({
          success: false,
          message: 'El ID de la competencia es requerido'
        });
      }

      await docentesService.assignCompetencia(parseInt(id), parseInt(id_competencia));

      return res.status(200).json({
        success: true,
        message: 'Competencia asignada correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Remover competencia de docente
  async removeCompetencia(req, res) {
    try {
      const { id } = req.params;
      const { id_competencia } = req.body;

      if (!id_competencia) {
        return res.status(400).json({
          success: false,
          message: 'El ID de la competencia es requerido'
        });
      }

      await docentesService.removeCompetencia(parseInt(id), parseInt(id_competencia));

      return res.status(200).json({
        success: true,
        message: 'Competencia removida correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DocentesController();