const programasService = require('../services/programasService');
const Joi = require('joi');

const programaSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).required().messages({
    'any.required': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 200 caracteres'
  }),
  codigo: Joi.string().min(2).max(20).required().messages({
    'any.required': 'El código es requerido',
    'string.min': 'El código debe tener al menos 2 caracteres',
    'string.max': 'El código no puede exceder 20 caracteres'
  }),
  tipo: Joi.string().valid('tecnico', 'tecnologia', 'asistente').required().messages({
    'any.required': 'El tipo es requerido',
    'any.only': 'El tipo debe ser tecnico, tecnologia o asistente'
  }),
  duracion_trimestres: Joi.number().integer().min(1).max(12).messages({
    'number.base': 'La duración debe ser un número',
    'number.integer': 'La duración debe ser un número entero',
    'number.min': 'La duración debe ser al menos 1 trimestre',
    'number.max': 'La duración no puede exceder 12 trimestres'
  }),
  tipo_oferta: Joi.string().valid('abierta', 'cerrada', 'encadenamiento').messages({
    'any.only': 'El tipo de oferta debe ser abierta, cerrada o encadenamiento'
  }),
  activo: Joi.boolean()
});

class ProgramasController {
  async getAll(req, res) {
    try {
      const programas = await programasService.getAll();
      return res.status(200).json({ success: true, count: programas.length, data: programas });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const programa = await programasService.getById(parseInt(id));
      
      if (!programa) {
        return res.status(404).json({ success: false, message: 'Programa no encontrado' });
      }
      
      return res.status(200).json({ success: true, data: programa });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = programaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const programa = await programasService.create(value);
      return res.status(201).json({ success: true, message: 'Programa creado correctamente', data: programa });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = programaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const programa = await programasService.update(parseInt(id), value);
      return res.status(200).json({ success: true, message: 'Programa actualizado correctamente', data: programa });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await programasService.delete(parseInt(id));
      return res.status(200).json({ success: true, message: 'Programa eliminado correctamente' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByTipo(req, res) {
    try {
      const { tipo } = req.params;
      const programas = await programasService.getByTipo(tipo);
      return res.status(200).json({ success: true, count: programas.length, data: programas });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProgramasController();