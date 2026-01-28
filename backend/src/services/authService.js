const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/auth');
const { executeQuery, executeProcedure } = require('../config/database');
const { sql } = require('../config/database');

class AuthService {
  // Login de usuario
  async login(username, password) {
    try {
      // Buscar usuario por username
      const users = await executeQuery(
        'SELECT * FROM usuarios WHERE username = @username AND activo = 1',
        [{ name: 'username', type: sql.VarChar, value: username }]
      );

      if (!users || users.length === 0) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      const user = users[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Generar token JWT
      const token = generateToken({
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
        id_docente: user.id_docente
      });

      return {
        success: true,
        token,
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          id_docente: user.id_docente,
          docente_nombre: user.docente_nombre || null
        }
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  // Cambiar contraseña
  async changePassword(id_usuario, oldPassword, newPassword) {
    try {
      // Obtener usuario
      const users = await executeQuery(
        'SELECT password_hash FROM usuarios WHERE id_usuario = @id_usuario AND activo = 1',
        [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
      );

      if (!users || users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const user = users[0];

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      await executeQuery(
        'UPDATE usuarios SET password_hash = @password_hash WHERE id_usuario = @id_usuario',
        [
          { name: 'password_hash', type: sql.VarChar, value: hashedPassword },
          { name: 'id_usuario', type: sql.Int, value: id_usuario }
        ]
      );

      return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new Error(`Error cambiando contraseña: ${error.message}`);
    }
  }

  // Crear usuario (solo admin)
  async createUser(username, password, rol, id_docente = null) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await executeQuery(
        'SELECT id_usuario FROM usuarios WHERE username = @username',
        [{ name: 'username', type: sql.VarChar, value: username }]
      );

      if (existingUser && existingUser.length > 0) {
        throw new Error('El nombre de usuario ya existe');
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const result = await executeQuery(
        `INSERT INTO usuarios (username, password_hash, rol, id_docente) 
         OUTPUT INSERTED.id_usuario, INSERTED.username, INSERTED.rol, INSERTED.id_docente
         VALUES (@username, @password_hash, @rol, @id_docente)`,
        [
          { name: 'username', type: sql.VarChar, value: username },
          { name: 'password_hash', type: sql.VarChar, value: hashedPassword },
          { name: 'rol', type: sql.VarChar, value: rol },
          { name: 'id_docente', type: sql.Int, value: id_docente }
        ]
      );

      return { success: true, user: result[0] };
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  // Obtener usuarios (solo admin)
  async getUsers() {
    try {
      const users = await executeQuery(
        `SELECT 
          u.id_usuario,
          u.username,
          u.rol,
          u.id_docente,
          d.nombre_apellido AS docente_nombre,
          u.fecha_creacion,
          u.activo
        FROM usuarios u
        LEFT JOIN docentes d ON u.id_docente = d.id_docente
        WHERE u.activo = 1
        ORDER BY u.fecha_creacion DESC`
      );

      return users;
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  // Actualizar usuario (solo admin)
  async updateUser(id_usuario, username, rol, id_docente = null, activo = 1) {
    try {
      const result = await executeQuery(
        `UPDATE usuarios 
         SET username = @username, rol = @rol, id_docente = @id_docente, activo = @activo
         OUTPUT INSERTED.id_usuario, INSERTED.username, INSERTED.rol, INSERTED.id_docente
         WHERE id_usuario = @id_usuario`,
        [
          { name: 'username', type: sql.VarChar, value: username },
          { name: 'rol', type: sql.VarChar, value: rol },
          { name: 'id_docente', type: sql.Int, value: id_docente },
          { name: 'activo', type: sql.Bit, value: activo },
          { name: 'id_usuario', type: sql.Int, value: id_usuario }
        ]
      );

      if (!result || result.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return { success: true, user: result[0] };
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  // Eliminar usuario (soft delete)
  async deleteUser(id_usuario) {
    try {
      await executeQuery(
        'UPDATE usuarios SET activo = 0 WHERE id_usuario = @id_usuario',
        [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
      );

      return { success: true, message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }
}

module.exports = new AuthService();