const { app, checkDatabaseConnection } = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    await checkDatabaseConnection();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log('=============================================');
      console.log('🚀 Sistema de Gestión de Horarios - SENA');
      console.log('=============================================');
      console.log(`✅ Servidor corriendo en puerto: ${PORT}`);
      console.log(`✅ Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log('=============================================');
    });

    // Manejo de cierre graceful
    const gracefulShutdown = (signal) => {
      console.log(`\n📡 Recibida señal ${signal}, cerrando servidor...`);
      
      server.close(async (err) => {
        if (err) {
          console.error('❌ Error cerrando servidor:', err);
          process.exit(1);
        }
        
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('uncaughtException', (err) => {
      console.error('❌ Error no capturado:', err);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Rechazo no manejado en:', promise, 'razón:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();