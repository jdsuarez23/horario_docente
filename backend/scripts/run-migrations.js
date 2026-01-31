const fs = require('fs');
const path = require('path');
const { ConnectionPool } = require('mssql');

// Cargar variables de entorno
require('dotenv').config();

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

async function runMigration(filePath, fileName) {
  let pool;
  try {
    console.log(`\n📝 Ejecutando: ${fileName}`);
    
    // Conectar
    pool = new ConnectionPool(config);
    await pool.connect();

    // Leer archivo
    const sql = fs.readFileSync(filePath, 'utf8');

    // Separar por GO y ejecutar
    const batches = sql.split(/\nGO\n/i).filter(b => b.trim());

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (!batch) continue;

      try {
        const request = pool.request();
        const result = await request.query(batch);
        
        // Log output messages from PRINT statements
        if (result && result.recordset && result.recordset.length > 0) {
          console.log(`   ${result.recordset[0]['']}`);
        }
      } catch (error) {
        console.error(`   ❌ Error en batch: ${error.message}`);
        throw error;
      }
    }

    console.log(`✅ ${fileName} completado\n`);
    await pool.close();
    return true;

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (pool) await pool.close();
    throw error;
  }
}

async function runAllMigrations() {
  try {
    console.log('\n🔄 Iniciando migraciones...\n');

    // Ejecutar migración de trimestre
    await runMigration(
      path.join(__dirname, '../../database/scripts/migration-add-trimestre.sql'),
      'migration-add-trimestre.sql'
    );

    // Ejecutar procedures actualizados
    const proceduresPath = path.join(__dirname, '../../database/scripts/procedures.sql');
    const proceduresSql = fs.readFileSync(proceduresPath, 'utf8');
    const batches = proceduresSql.split(/\nGO\n/i).filter(b => b.trim());
    
    console.log(`📝 Ejecutando: procedures.sql (${batches.length} batches)\n`);
    
    let pool = new ConnectionPool(config);
    await pool.connect();

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (!batch) continue;

      try {
        const request = pool.request();
        await request.query(batch);
        process.stdout.write(`✅ Batch ${i + 1}/${batches.length}\r`);
      } catch (error) {
        console.error(`\n❌ Error en batch ${i + 1}: ${error.message}`);
      }
    }

    await pool.close();
    console.log('\n✅ procedures.sql completado\n');

    console.log('✅ ¡Todas las migraciones completadas exitosamente!');

  } catch (error) {
    console.error('\n❌ Error durante migraciones:', error.message);
    process.exit(1);
  }
}

runAllMigrations();
