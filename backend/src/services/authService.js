const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/auth');
const { executeQuery } = require('../config/database');
const { sql } = require('../config/database');

class AuthService {
  // Login de usuario
  async login(username, password) {
    try {
      // Buscar usuario por username
      const users = await executeQuery(
        'SELECT id_usuario, username, password_hash, rol, id_docente, activo FROM usuarios WHERE username = @username AND activo = 1',
        [{ name: 'username', type: sql.VarChar, value: username }]
      );

      if (!users || users.length === 0) {
        throw new Error('Usuario o contraseña inválidos');
      }

      const user = users[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Usuario o contraseña inválidos');
      }

      // Generar token JWT
      const token = generateToken({
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
        id_docente: user.id_docente
      });

      return {
        token,
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          id_docente: user.id_docente
        }
      };
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(id_usuario, oldPassword, newPassword) {
    try {
      // Obtener usuario
      const users = await executeQuery(
        'SELECT password_hash FROM usuarios WHERE id_usuario = @id_usuario',
        [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
      );

      if (!users || users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña antigua
      const isValidPassword = await bcrypt.compare(oldPassword, users[0].password_hash);
      if (!isValidPassword) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Hash de nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      await executeQuery(
        'UPDATE usuarios SET password_hash = @password_hash WHERE id_usuario = @id_usuario',
        [
          { name: 'password_hash', type: sql.VarChar, value: hashedPassword },
          { name: 'id_usuario', type: sql.Int, value: id_usuario }
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Error en changePassword:', error);
      throw error;
    }
  }

  // Crear usuario
  async createUser(username, password, rol, id_docente = null) {
    try {
      // Verificar que el usuario no exista
      const existingUsers = await executeQuery(
        'SELECT id_usuario FROM usuarios WHERE username = @username',
        [{ name: 'username', type: sql.VarChar, value: username }]
      );

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('El usuario ya existe');
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const result = await executeQuery(
        `INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
         VALUES (@username, @password_hash, @rol, @id_docente, 1, GETDATE())`,
        [
          { name: 'username', type: sql.VarChar, value: username },
          { name: 'password_hash', type: sql.VarChar, value: hashedPassword },
          { name: 'rol', type: sql.VarChar, value: rol },
          { name: 'id_docente', type: sql.Int, value: id_docente }
        ]
      );

      return { success: true, message: 'Usuario creado' };
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  // Obtener usuarios
  async getUsers() {
    try {
      const users = await executeQuery(
        'SELECT id_usuario, username, rol, id_docente, activo FROM usuarios'
      );

      return users || [];
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUser(id_usuario, updateData) {
    try {
      const setClauses = [];
      const params = [];

      if (updateData.username) {
        setClauses.push('username = @username');
        params.push({ name: 'username', type: sql.VarChar, value: updateData.username });
      }

      if (updateData.rol) {
        setClauses.push('rol = @rol');
        params.push({ name: 'rol', type: sql.VarChar, value: updateData.rol });
      }

      if (updateData.id_docente !== undefined) {
        setClauses.push('id_docente = @id_docente');
        params.push({ name: 'id_docente', type: sql.Int, value: updateData.id_docente });
      }

      if (updateData.activo !== undefined) {
        setClauses.push('activo = @activo');
        params.push({ name: 'activo', type: sql.Int, value: updateData.activo });
      }

      if (setClauses.length === 0) {
        throw new Error('No hay datos para actualizar');
      }

      params.push({ name: 'id_usuario', type: sql.Int, value: id_usuario });

      await executeQuery(
        `UPDATE usuarios SET ${setClauses.join(', ')} WHERE id_usuario = @id_usuario`,
        params
      );

      return { success: true };
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  // Eliminar usuario (soft delete)
  async deleteUser(id_usuario) {
    try {
      await executeQuery(
        'UPDATE usuarios SET activo = 0 WHERE id_usuario = @id_usuario',
        [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
      );

      return { success: true };
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getProfile(id_usuario) {
    try {
      const users = await executeQuery(
        'SELECT id_usuario, username, rol, id_docente FROM usuarios WHERE id_usuario = @id_usuario AND activo = 1',
        [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
      );

      if (!users || users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return users[0];
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();