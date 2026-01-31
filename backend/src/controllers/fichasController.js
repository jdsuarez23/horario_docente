const fichasService = require('../services/fichasService');
const Joi = require('joi');

const fichaSchema = Joi.object({
  codigo: Joi.string().min(3).max(20).required().messages({
    'any.required': 'El código es requerido',
    'string.min': 'El código debe tener al menos 3 caracteres',
    'string.max': 'El código no puede exceder 20 caracteres'
  }),
  id_programa: Joi.number().integer().required().messages({
    'any.required': 'El programa es requerido',
    'number.base': 'El ID del programa debe ser un número',
    'number.integer': 'El ID del programa debe ser un número entero'
  }),
  trimestre: Joi.number().integer().min(1).max(6).allow(null).allow('').messages({
    'number.base': 'El trimestre debe ser un número',
    'number.min': 'El trimestre debe ser entre 1 y 6',
    'number.max': 'El trimestre debe ser entre 1 y 6'
  }),
  fecha_inicio: Joi.date().allow(null).messages({
    'date.base': 'La fecha de inicio debe ser una fecha válida'
  }),
  fecha_fin: Joi.date().allow(null).messages({
    'date.base': 'La fecha de fin debe ser una fecha válida'
  }),
  activo: Joi.boolean()
});

class FichasController {
  async getAll(req, res) {
    try {
      const fichas = await fichasService.getAll();
      return res.status(200).json({ success: true, count: fichas.length, data: fichas });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const ficha = await fichasService.getById(parseInt(id));
      
      if (!ficha) {
        return res.status(404).json({ success: false, message: 'Ficha no encontrada' });
      }
      
      return res.status(200).json({ success: true, data: ficha });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = fichaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const ficha = await fichasService.create(value);
      return res.status(201).json({ success: true, message: 'Ficha creada correctamente', data: ficha });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = fichaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const ficha = await fichasService.update(parseInt(id), value);
      return res.status(200).json({ success: true, message: 'Ficha actualizada correctamente', data: ficha });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await fichasService.delete(parseInt(id));
      return res.status(200).json({ success: true, message: 'Ficha eliminada correctamente' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async search(req, res) {
    try {
      const { termino } = req.query;
      if (!termino) {
        return res.status(400).json({ success: false, message: 'El término de búsqueda es requerido' });
      }

      const fichas = await fichasService.search(termino);
      return res.status(200).json({ success: true, count: fichas.length, data: fichas });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHorarios(req, res) {
    try {
      const { id } = req.params;
      const horarios = await fichasService.getHorarios(parseInt(id));
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FichasController();