const fs = require('fs');
const path = require('path');
const { ConnectionPool, config: sqlConfig, VarChar, Int, Time } = require('mssql');

// Configuración
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'SENA_Horarios',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'Jdsuarez23'
    }
  },
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    encrypt: false
  }
};

async function executeProceduresScript() {
  let pool;
  try {
    // Conectar
    console.log('🔄 Conectando a SQL Server...');
    pool = new ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado exitosamente\n');

    // Leer archivo
    const proceduresPath = path.join(__dirname, '../../database/scripts/procedures.sql');
    const proceduresSql = fs.readFileSync(proceduresPath, 'utf8');

    // Separar por GO y ejecutar
    const batches = proceduresSql.split(/\nGO\n/i).filter(b => b.trim());
    console.log(`📝 ${batches.length} batches encontrados\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (!batch) continue;

      try {
        const request = pool.request();
        await request.query(batch);
        successCount++;
        process.stdout.write(`✅ Batch ${i + 1}/${batches.length}\r`);
      } catch (error) {
        errorCount++;
        console.error(`\n❌ Error en batch ${i + 1}: ${error.message}`);
      }
    }

    console.log(`\n\n📊 Resultado:`);
    console.log(`   ✅ Exitosos: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`\n✅ Procedures actualizados correctamente`);

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

executeProceduresScript();
