const horariosService = require('../services/horariosService');
const Joi = require('joi');

const horarioSchema = Joi.object({
  dia: Joi.string().valid('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado').required().messages({
    'any.required': 'El día es requerido',
    'any.only': 'El día debe ser lunes, martes, miercoles, jueves, viernes o sabado'
  }),
  hora_inicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).required().messages({
    'any.required': 'La hora de inicio es requerida',
    'string.pattern.base': 'Formato de hora inválido. Use HH:MM:SS'
  }),
  hora_fin: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).required().messages({
    'any.required': 'La hora de fin es requerida',
    'string.pattern.base': 'Formato de hora inválido. Use HH:MM:SS'
  }),
  id_docente: Joi.number().integer().required().messages({
    'any.required': 'El docente es requerido',
    'number.base': 'El ID del docente debe ser un número',
    'number.integer': 'El ID del docente debe ser un número entero'
  }),
  id_ficha: Joi.number().integer().required().messages({
    'any.required': 'La ficha es requerida',
    'number.base': 'El ID de la ficha debe ser un número',
    'number.integer': 'El ID de la ficha debe ser un número entero'
  }),
  id_salon: Joi.number().integer().required().messages({
    'any.required': 'El salón es requerido',
    'number.base': 'El ID del salón debe ser un número',
    'number.integer': 'El ID del salón debe ser un número entero'
  }),
  id_competencia: Joi.number().integer().required().messages({
    'any.required': 'La competencia es requerida',
    'number.base': 'El ID de la competencia debe ser un número',
    'number.integer': 'El ID de la competencia debe ser un número entero'
  })
});

class HorariosController {
  async getAll(req, res) {
    try {
      const filters = {
        id_docente: req.query.id_docente,
        id_ficha: req.query.id_ficha,
        id_salon: req.query.id_salon,
        dia: req.query.dia
      };

      const horarios = await horariosService.getAll(filters);
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const horario = await horariosService.getById(parseInt(id));
      
      if (!horario) {
        return res.status(404).json({ success: false, message: 'Horario no encontrado' });
      }
      
      return res.status(200).json({ success: true, data: horario });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = horarioSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const horario = await horariosService.create(value);
      return res.status(201).json({ success: true, message: 'Horario creado correctamente', data: horario });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = horarioSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const horario = await horariosService.update(parseInt(id), value);
      return res.status(200).json({ success: true, message: 'Horario actualizado correctamente', data: horario });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await horariosService.delete(parseInt(id));
      return res.status(200).json({ success: true, message: 'Horario eliminado correctamente' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByDocente(req, res) {
    try {
      const { id } = req.params;
      const horarios = await horariosService.getByDocente(parseInt(id));
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByFicha(req, res) {
    try {
      const { id } = req.params;
      const horarios = await horariosService.getByFicha(parseInt(id));
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBySalon(req, res) {
    try {
      const { id } = req.params;
      const horarios = await horariosService.getBySalon(parseInt(id));
      return res.status(200).json({ success: true, count: horarios.length, data: horarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async checkDisponibilidad(req, res) {
    try {
      const disponibilidad = await horariosService.getDisponibilidad(req.body);
      return res.status(200).json({ success: true, data: disponibilidad });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new HorariosController();