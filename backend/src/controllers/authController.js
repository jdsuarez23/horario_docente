const authService = require('../services/authService');
const Joi = require('joi');

// Esquema de validación para login
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'El nombre de usuario es requerido'
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida'
  })
});

// Esquema de validación para cambiar contraseña
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'La nueva contraseña es requerida',
    'string.min': 'La nueva contraseña debe tener al menos 6 caracteres'
  })
});

// Esquema de validación para crear usuario
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required().messages({
    'any.required': 'El nombre de usuario es requerido',
    'string.alphanum': 'El nombre de usuario solo puede contener letras y números',
    'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
    'string.max': 'El nombre de usuario no puede exceder 50 caracteres'
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'La contraseña es requerida',
    'string.min': 'La contraseña debe tener al menos 6 caracteres'
  }),
  rol: Joi.string().valid('admin', 'coordinador', 'docente').required().messages({
    'any.required': 'El rol es requerido',
    'any.only': 'El rol debe ser admin, coordinador o docente'
  }),
  id_docente: Joi.number().integer().allow(null).messages({
    'number.base': 'El ID del docente debe ser un número entero'
  })
});

class AuthController {
  // Login
  async login(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { username, password } = value;

      // Intentar login
      const result = await authService.login(username, password);

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = changePasswordSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { oldPassword, newPassword } = value;
      const id_usuario = req.user.id_usuario;

      const result = await authService.changePassword(id_usuario, oldPassword, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Crear usuario (solo admin)
  async createUser(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = createUserSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { username, password, rol, id_docente } = value;

      const result = await authService.createUser(username, password, rol, id_docente);

      return res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente',
        data: result.user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener usuarios (solo admin)
  async getUsers(req, res) {
    try {
      const users = await authService.getUsers();

      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Actualizar usuario (solo admin)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, rol, id_docente, activo } = req.body;

      if (!username || !rol) {
        return res.status(400).json({
          success: false,
          message: 'Username y rol son requeridos'
        });
      }

      const result = await authService.updateUser(
        parseInt(id),
        username,
        rol,
        id_docente || null,
        activo !== undefined ? activo : 1
      );

      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: result.user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Eliminar usuario (solo admin)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await authService.deleteUser(parseInt(id));

      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile(req, res) {
    try {
      const user = req.user;

      return res.status(200).json({
        success: true,
        data: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          id_docente: user.id_docente
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();