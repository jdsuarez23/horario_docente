const express = require('express');
const router = express.Router();
const salonesController = require('../controllers/salonesController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, salonesController.getAll);
router.get('/:id', authenticateToken, salonesController.getById);
router.get('/:id/horarios', authenticateToken, salonesController.getHorarios);

// Rutas solo admin
router.post('/', authenticateToken, requireAdmin, salonesController.create);
router.put('/:id', authenticateToken, requireAdmin, salonesController.update);
router.delete('/:id', authenticateToken, requireAdmin, salonesController.delete);

module.exports = router;