const salonesService = require('../services/salonesService');
const Joi = require('joi');

const salonSchema = Joi.object({
  nombre: Joi.string().min(3).max(50).required().messages({
    'any.required': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres'
  }),
  numero: Joi.string().max(10).allow('').messages({
    'string.max': 'El número no puede exceder 10 caracteres'
  }),
  capacidad: Joi.number().integer().min(1).max(100).messages({
    'number.base': 'La capacidad debe ser un número',
    'number.integer': 'La capacidad debe ser un número entero',
    'number.min': 'La capacidad debe ser al menos 1',
    'number.max': 'La capacidad no puede exceder 100'
  }),
  ubicacion: Joi.string().max(100).allow('').messages({
    'string.max': 'La ubicación no puede exceder 100 caracteres'
  }),
  activo: Joi.boolean()
});

class SalonesController {
  async getAll(req, res) {
    try {
      const salones = await salonesService.getAll();
      return res.status(200).json({ success: true, count: salones.length, data: salones });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const salon = await salonesService.getById(parseInt(id));
      
      if (!salon) {
        return res.status(404).json({ success: false, message: 'Salón no encontrado' });
      }
      
      return res.status(200).json({ success: true, data: salon });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = salonSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const salon = await salonesService.create(value);
      return res.status(201).json({ success: true, message: 'Salón creado correctamente', data: salon });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = salonSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const salon = await salonesService.update(parseInt(id), value);
      return res.status(200).json({ success: true, message: 'Salón actualizado correctamente', data: salon });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await salonesService.delete(parseInt(id));
      return res.status(200).json({ success: true, message: 'Salón eliminado correctamente' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHorarios(req, res) {
    try {
      const { id } = req.params;
      const horarios = await salonesService.getHorarios(parseInt(id));
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SalonesController();