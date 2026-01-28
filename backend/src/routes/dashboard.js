const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Rutas del dashboard (autenticadas)
router.get('/stats', authenticateToken, dashboardController.getStats);
router.get('/search', authenticateToken, dashboardController.search);
router.get('/horarios', authenticateToken, dashboardController.getHorarios);

module.exports = router;