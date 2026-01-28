const express = require('express');
const router = express.Router();
const programasController = require('../controllers/programasController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, programasController.getAll);
router.get('/:id', authenticateToken, programasController.getById);
router.get('/tipo/:tipo', authenticateToken, programasController.getByTipo);

// Rutas solo admin
router.post('/', authenticateToken, requireAdmin, programasController.create);
router.put('/:id', authenticateToken, requireAdmin, programasController.update);
router.delete('/:id', authenticateToken, requireAdmin, programasController.delete);

module.exports = router;