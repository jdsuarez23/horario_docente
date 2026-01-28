#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const sql = require('mssql');
require('dotenv').config();

// Configuración de conexión
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'SENA_Horarios',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD
    }
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
    enableKeepAlive: true,
    connectTimeout: 15000
  }
};

// Usuarios de prueba
const testUsers = [
  { username: 'admin', password: 'admin123', rol: 'admin', id_docente: null },
  { username: 'coordinador', password: 'coord123', rol: 'coordinador', id_docente: null },
  { username: 'carlos.rodriguez', password: 'docente123', rol: 'docente', id_docente: 1 },
  { username: 'maria.garcia', password: 'docente123', rol: 'docente', id_docente: 2 },
  { username: 'jose.hernandez', password: 'docente123', rol: 'docente', id_docente: 3 }
];

async function updateUsers() {
  let pool;
  try {
    console.log('🔐 Conectando a la base de datos...');
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado a la base de datos\n');

    // Limpiar usuarios existentes
    console.log('🧹 Limpiando usuarios existentes...');
    await pool.request().query('DELETE FROM usuarios');
    console.log('✅ Usuarios eliminados\n');

    // Insertar nuevos usuarios
    console.log('👤 Creando usuarios con contraseñas hasheadas...\n');
    
    for (const user of testUsers) {
      const hash = await bcrypt.hash(user.password, 10);
      console.log(`Usuario: ${user.username}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Hash: ${hash}\n`);

      const request = pool.request();
      request.input('username', sql.VarChar(100), user.username);
      request.input('password_hash', sql.VarChar(255), hash);
      request.input('rol', sql.VarChar(50), user.rol);
      request.input('id_docente', sql.Int, user.id_docente);

      await request.query(
        `INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion) 
         VALUES (@username, @password_hash, @rol, @id_docente, 1, GETDATE())`
      );
    }

    console.log('✅ Usuarios creados exitosamente\n');

    // Verificar usuarios
    console.log('📋 Usuarios en la base de datos:');
    const result = await pool.request().query('SELECT id_usuario, username, rol FROM usuarios');
    console.table(result.recordset);

    console.log('\n✅ Actualización completada');
    console.log('\n📝 Datos de login:');
    console.log('  admin / admin123');
    console.log('  coordinador / coord123');
    console.log('  carlos.rodriguez / docente123');
    console.log('  maria.garcia / docente123');
    console.log('  jose.hernandez / docente123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

updateUsers();
