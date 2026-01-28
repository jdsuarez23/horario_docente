const express = require('express');
const router = express.Router();
const competenciasController = require('../controllers/competenciasController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, competenciasController.getAll);
router.get('/:id', authenticateToken, competenciasController.getById);
router.get('/docente/:id', authenticateToken, competenciasController.getByDocente);

// Rutas solo admin
router.post('/', authenticateToken, requireAdmin, competenciasController.create);
router.put('/:id', authenticateToken, requireAdmin, competenciasController.update);
router.delete('/:id', authenticateToken, requireAdmin, competenciasController.delete);

module.exports = router;