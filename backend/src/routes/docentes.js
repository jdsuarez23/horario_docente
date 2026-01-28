const express = require('express');
const router = express.Router();
const docentesController = require('../controllers/docentesController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, docentesController.getAll);
router.get('/search', authenticateToken, docentesController.search);
router.get('/:id', authenticateToken, docentesController.getById);
router.get('/:id/horarios', authenticateToken, docentesController.getHorarios);

// Rutas solo admin
router.post('/', authenticateToken, requireAdmin, docentesController.create);
router.put('/:id', authenticateToken, requireAdmin, docentesController.update);
router.delete('/:id', authenticateToken, requireAdmin, docentesController.delete);

// Rutas para asignar/remover competencias (admin y coordinador)
router.post('/:id/competencias', authenticateToken, requireCoordinadorOrAdmin, docentesController.assignCompetencia);
router.delete('/:id/competencias', authenticateToken, requireCoordinadorOrAdmin, docentesController.removeCompetencia);

module.exports = router;