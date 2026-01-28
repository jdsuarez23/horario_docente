const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Ruta de login (pública)
router.post('/login', authController.login);

// Ruta para cambiar contraseña (autenticada)
router.put('/change-password', authenticateToken, authController.changePassword);

// Ruta para obtener perfil (autenticada)
router.get('/profile', authenticateToken, authController.getProfile);

// Rutas de usuarios (solo admin)
router.get('/users', authenticateToken, requireAdmin, authController.getUsers);
router.post('/users', authenticateToken, requireAdmin, authController.createUser);
router.put('/users/:id', authenticateToken, requireAdmin, authController.updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, authController.deleteUser);

module.exports = router;