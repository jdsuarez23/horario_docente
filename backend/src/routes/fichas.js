const express = require('express');
const router = express.Router();
const fichasController = require('../controllers/fichasController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, fichasController.getAll);
router.get('/search', authenticateToken, fichasController.search);
router.get('/:id', authenticateToken, fichasController.getById);
router.get('/:id/horarios', authenticateToken, fichasController.getHorarios);

// Rutas solo admin
router.post('/', authenticateToken, requireAdmin, fichasController.create);
router.put('/:id', authenticateToken, requireAdmin, fichasController.update);
router.delete('/:id', authenticateToken, requireAdmin, fichasController.delete);

module.exports = router;