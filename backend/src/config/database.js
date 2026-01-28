const sql = require('mssql');
require('dotenv').config();

// Configuración de la conexión a SQL Server
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'SENA_Horarios',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Crear pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server exitosamente');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error conectando a SQL Server:', err);
    process.exit(1);
  });

// Función para ejecutar consultas
const executeQuery = async (query, params = []) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    
    // Agregar parámetros
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error ejecutando query:', err);
    throw err;
  }
};

// Función para ejecutar procedimientos almacenados
const executeProcedure = async (procedureName, params = []) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    
    // Agregar parámetros
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (err) {
    console.error(`Error ejecutando procedimiento ${procedureName}:`, err);
    throw err;
  }
};

// Función para ejecutar transacciones
const executeTransaction = async (queries) => {
  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    
    await transaction.begin();
    
    const request = new sql.Request(transaction);
    const results = [];
    
    for (const queryObj of queries) {
      const { query, params } = queryObj;
      
      // Agregar parámetros
      if (params) {
        params.forEach(param => {
          request.input(param.name, param.type, param.value);
        });
      }
      
      const result = await request.query(query);
      results.push(result);
    }
    
    await transaction.commit();
    return results;
  } catch (err) {
    await transaction.rollback();
    console.error('Error en transacción:', err);
    throw err;
  }
};

module.exports = {
  sql,
  poolPromise,
  executeQuery,
  executeProcedure,
  executeTransaction,
  config
};