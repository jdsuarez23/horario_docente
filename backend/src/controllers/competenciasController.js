const competenciasService = require('../services/competenciasService');
const Joi = require('joi');

const competenciaSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).required().messages({
    'any.required': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 200 caracteres'
  }),
  codigo: Joi.string().min(3).max(20).required().messages({
    'any.required': 'El código es requerido',
    'string.min': 'El código debe tener al menos 3 caracteres',
    'string.max': 'El código no puede exceder 20 caracteres'
  }),
  duracion_horas: Joi.number().integer().min(0).messages({
    'number.base': 'La duración debe ser un número',
    'number.integer': 'La duración debe ser un número entero',
    'number.min': 'La duración debe ser mayor o igual a 0'
  }),
  activo: Joi.boolean()
});

class CompetenciasController {
  async getAll(req, res) {
    try {
      const competencias = await competenciasService.getAll();
      return res.status(200).json({ success: true, count: competencias.length, data: competencias });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const competencia = await competenciasService.getById(parseInt(id));
      
      if (!competencia) {
        return res.status(404).json({ success: false, message: 'Competencia no encontrada' });
      }
      
      return res.status(200).json({ success: true, data: competencia });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = competenciaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const competencia = await competenciasService.create(value);
      return res.status(201).json({ success: true, message: 'Competencia creada correctamente', data: competencia });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = competenciaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const competencia = await competenciasService.update(parseInt(id), value);
      return res.status(200).json({ success: true, message: 'Competencia actualizada correctamente', data: competencia });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await competenciasService.delete(parseInt(id));
      return res.status(200).json({ success: true, message: 'Competencia eliminada correctamente' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByDocente(req, res) {
    try {
      const { id } = req.params;
      const competencias = await competenciasService.getByDocente(parseInt(id));
      return res.status(200).json({ success: true, count: competencias.length, data: competencias });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CompetenciasController();