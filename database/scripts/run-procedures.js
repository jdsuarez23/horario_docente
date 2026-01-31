const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// Configuración de la base de datos
const config = {
  server: 'localhost',
  database: 'horario_docente',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'Sena123456!'
    }
  },
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    encrypt: false
  }
};

async function executeProceduresScript() {
  try {
    // Leer archivo procedures.sql
    const proceduresPath = path.join(__dirname, 'procedures.sql');
    const proceduresSql = fs.readFileSync(proceduresPath, 'utf8');

    // Conectar a la BD
    console.log('🔄 Conectando a la base de datos...');
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado a la base de datos');

    // Ejecutar el script
    console.log('\n🔄 Ejecutando procedures.sql...');
    
    // Separar por GO statements
    const batches = proceduresSql.split(/\n\s*GO\s*(?:\n|$)/gi).filter(b => b.trim());
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (!batch) continue;
      
      try {
        await pool.request().query(batch);
        console.log(`✅ Batch ${i + 1}/${batches.length} ejecutado correctamente`);
      } catch (batchError) {
        console.error(`❌ Error en batch ${i + 1}:`, batchError.message);
        // Continuar con los siguientes batches
      }
    }

    console.log('\n✅ Procedures.sql ejecutado correctamente');

    // Cerrar conexión
    await pool.close();
    console.log('✅ Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
executeProceduresScript();
