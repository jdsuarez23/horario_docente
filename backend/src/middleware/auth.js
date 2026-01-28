const { verifyToken } = require('../config/auth');
const { executeQuery } = require('../config/database');
const { sql } = require('../config/database');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que el usuario aún existe y está activo
    const users = await executeQuery(
      'SELECT id_usuario, username, rol, id_docente, activo FROM usuarios WHERE id_usuario = @id_usuario AND activo = 1',
      [{ name: 'id_usuario', type: sql.Int, value: decoded.id_usuario }]
    );

    if (!users || users.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.'
    });
  }
  next();
};

// Middleware para verificar rol de coordinador o admin
const requireCoordinadorOrAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'coordinador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de coordinador o administrador.'
    });
  }
  next();
};

// Middleware para verificar rol de docente (solo puede ver su información)
const requireDocenteAccess = (req, res, next) => {
  // Si es docente, solo puede acceder a su propia información
  if (req.user.rol === 'docente') {
    const id_docente = parseInt(req.params.id_docente || req.body.id_docente || req.query.id_docente);
    
    if (id_docente && id_docente !== req.user.id_docente) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo puede acceder a su propia información.'
      });
    }
  }
  next();
};

// Middleware para verificar acceso a recursos del docente
const checkDocenteResourceAccess = (req, res, next) => {
  // Si es docente, verificar que el recurso le pertenece
  if (req.user.rol === 'docente') {
    const resourceId = parseInt(req.params.id || req.body.id || req.query.id);
    
    // Aquí se pueden agregar validaciones específicas según el recurso
    // Por ejemplo, verificar que un horario pertenece al docente
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCoordinadorOrAdmin,
  requireDocenteAccess,
  checkDocenteResourceAccess
};