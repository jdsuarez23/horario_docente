const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController');
const { authenticateToken, requireAdmin, requireCoordinadorOrAdmin } = require('../middleware/auth');

// Rutas públicas para usuarios autenticados
router.get('/', authenticateToken, horariosController.getAll);
router.get('/:id', authenticateToken, horariosController.getById);
router.get('/docente/:id', authenticateToken, horariosController.getByDocente);
router.get('/ficha/:id', authenticateToken, horariosController.getByFicha);
router.get('/salon/:id', authenticateToken, horariosController.getBySalon);
router.post('/disponibilidad', authenticateToken, horariosController.checkDisponibilidad);

// Rutas solo admin y coordinador
router.post('/', authenticateToken, requireCoordinadorOrAdmin, horariosController.create);
router.put('/:id', authenticateToken, requireCoordinadorOrAdmin, horariosController.update);
router.delete('/:id', authenticateToken, requireCoordinadorOrAdmin, horariosController.delete);

module.exports = router;