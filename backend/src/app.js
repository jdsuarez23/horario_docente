const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const docentesRoutes = require('./routes/docentes');
const competenciasRoutes = require('./routes/competencias');
const programasRoutes = require('./routes/programas');
const fichasRoutes = require('./routes/fichas');
const salonesRoutes = require('./routes/salones');
const horariosRoutes = require('./routes/horarios');
const dashboardRoutes = require('./routes/dashboard');

// Crear aplicación Express
const app = express();

// =============================================
// Middlewares
// =============================================

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, permitir localhost en cualquier puerto
      callback(null, true);
    } else {
      // En producción, solo permitir FRONTEND_URL_PROD
      const allowedOrigins = [process.env.FRONTEND_URL_PROD];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
};
app.use(cors(corsOptions));

// Seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado para permitir CORS
  crossOriginEmbedderPolicy: false
}));

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// Rutas
// =============================================

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Gestión de Horarios Académicos - SENA API',
    version: '1.0.0',
    status: 'running'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/docentes', docentesRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/programas', programasRoutes);
app.use('/api/fichas', fichasRoutes);
app.use('/api/salones', salonesRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =============================================
// Manejo de errores
// =============================================

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =============================================
// Inicialización de base de datos
// =============================================

const { poolPromise } = require('./config/database');

// Verificar conexión a base de datos al iniciar
const checkDatabaseConnection = async () => {
  try {
    await poolPromise;
    console.log('✅ Conexión a base de datos verificada');
  } catch (error) {
    console.error('❌ Error conectando a base de datos:', error);
    process.exit(1);
  }
};

// =============================================
// Exportar aplicación
// =============================================

module.exports = { app, checkDatabaseConnection };