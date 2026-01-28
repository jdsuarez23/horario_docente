#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const sql = require('mssql');
const readline = require('readline');
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

let pool;

// Crear interfaz readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para hacer preguntas en la consola
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Función para mostrar menú principal
async function menuPrincipal() {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     GESTIÓN DE HORARIOS ACADÉMICOS - SENA                 ║');
  console.log('║     Sistema de Administración de Datos                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('Selecciona qué deseas gestionar:\n');
  console.log('1. 👤 Usuarios');
  console.log('2. 🎯 Competencias');
  console.log('3. 📚 Programas');
  console.log('4. 📋 Fichas');
  console.log('5. 👨‍🏫 Docentes');
  console.log('6. 🚪 Salir\n');

  const opcion = await question('Selecciona una opción (1-6): ');
  return opcion;
}

// USUARIOS
async function menuUsuarios() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('             GESTIÓN DE USUARIOS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('¿Qué acción deseas realizar?\n');
  console.log('1. ➕ Crear usuario');
  console.log('2. 📋 Listar usuarios');
  console.log('3. ✏️  Actualizar usuario');
  console.log('4. 🗑️  Eliminar usuario');
  console.log('5. ⬅️  Volver al menú principal\n');

  const opcion = await question('Selecciona una opción (1-5): ');
  
  switch (opcion) {
    case '1':
      await crearUsuario();
      break;
    case '2':
      await listarUsuarios();
      break;
    case '3':
      await actualizarUsuario();
      break;
    case '4':
      await eliminarUsuario();
      break;
    case '5':
      return;
    default:
      console.log('❌ Opción no válida');
  }

  await menuUsuarios();
}

async function crearUsuario() {
  console.log('\n--- Crear nuevo usuario ---\n');
  
  const username = await question('Nombre de usuario: ');
  const password = await question('Contraseña: ');
  const rol = await question('Rol (admin/coordinador/docente): ');
  const id_docente = await question('ID Docente (dejar en blanco si no aplica): ');

  try {
    const hash = await bcrypt.hash(password, 10);
    const request = pool.request();
    request.input('username', sql.VarChar(100), username);
    request.input('password_hash', sql.VarChar(255), hash);
    request.input('rol', sql.VarChar(50), rol);
    request.input('id_docente', sql.Int, id_docente || null);

    await request.query(
      `INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
       VALUES (@username, @password_hash, @rol, @id_docente, 1, GETDATE())`
    );

    console.log(`\n✅ Usuario '${username}' creado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function listarUsuarios() {
  console.log('\n--- Listado de usuarios ---\n');

  try {
    const result = await pool.request().query(
      'SELECT id_usuario, username, rol, id_docente, activo FROM usuarios ORDER BY fecha_creacion DESC'
    );

    if (result.recordset.length === 0) {
      console.log('No hay usuarios registrados.\n');
    } else {
      console.table(result.recordset);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function actualizarUsuario() {
  console.log('\n--- Actualizar usuario ---\n');
  
  const id = await question('ID del usuario a actualizar: ');
  const nuevoRol = await question('Nuevo rol (dejar en blanco para no cambiar): ');
  const nuevoActivo = await question('¿Activo? (1=sí, 0=no, dejar en blanco para no cambiar): ');

  try {
    const request = pool.request();
    request.input('id_usuario', sql.Int, parseInt(id));

    let query = 'UPDATE usuarios SET';
    const campos = [];

    if (nuevoRol) {
      request.input('rol', sql.VarChar(50), nuevoRol);
      campos.push('rol = @rol');
    }

    if (nuevoActivo) {
      request.input('activo', sql.Bit, parseInt(nuevoActivo));
      campos.push('activo = @activo');
    }

    if (campos.length === 0) {
      console.log('❌ No hay cambios para aplicar\n');
      return;
    }

    query += ' ' + campos.join(', ') + ' WHERE id_usuario = @id_usuario';

    await request.query(query);
    console.log(`\n✅ Usuario actualizado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function eliminarUsuario() {
  console.log('\n--- Eliminar usuario ---\n');
  
  const id = await question('ID del usuario a eliminar (soft delete): ');
  const confirmar = await question('¿Estás seguro? (s/n): ');

  if (confirmar.toLowerCase() !== 's') {
    console.log('Operación cancelada.\n');
    await question('Presiona Enter para continuar...');
    return;
  }

  try {
    const request = pool.request();
    request.input('id_usuario', sql.Int, parseInt(id));

    await request.query('UPDATE usuarios SET activo = 0 WHERE id_usuario = @id_usuario');
    console.log(`\n✅ Usuario eliminado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

// COMPETENCIAS
async function menuCompetencias() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('             GESTIÓN DE COMPETENCIAS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('¿Qué acción deseas realizar?\n');
  console.log('1. ➕ Crear competencia');
  console.log('2. 📋 Listar competencias');
  console.log('3. ✏️  Actualizar competencia');
  console.log('4. 🗑️  Eliminar competencia');
  console.log('5. ⬅️  Volver al menú principal\n');

  const opcion = await question('Selecciona una opción (1-5): ');
  
  switch (opcion) {
    case '1':
      await crearCompetencia();
      break;
    case '2':
      await listarCompetencias();
      break;
    case '3':
      await actualizarCompetencia();
      break;
    case '4':
      await eliminarCompetencia();
      break;
    case '5':
      return;
    default:
      console.log('❌ Opción no válida');
  }

  await menuCompetencias();
}

async function crearCompetencia() {
  console.log('\n--- Crear nueva competencia ---\n');
  
  const nombre = await question('Nombre de la competencia: ');
  const codigo = await question('Código (ej: COMP001): ');
  const horas = await question('Duración en horas: ');

  try {
    const request = pool.request();
    request.input('nombre', sql.VarChar(255), nombre);
    request.input('codigo', sql.VarChar(50), codigo);
    request.input('duracion_horas', sql.Int, parseInt(horas) || 80);

    await request.query(
      `INSERT INTO competencias (nombre, codigo, duracion_horas, activo, fecha_creacion)
       VALUES (@nombre, @codigo, @duracion_horas, 1, GETDATE())`
    );

    console.log(`\n✅ Competencia '${nombre}' creada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function listarCompetencias() {
  console.log('\n--- Listado de competencias ---\n');

  try {
    const result = await pool.request().query(
      'SELECT id_competencia, nombre, codigo, duracion_horas, activo FROM competencias ORDER BY fecha_creacion DESC'
    );

    if (result.recordset.length === 0) {
      console.log('No hay competencias registradas.\n');
    } else {
      console.table(result.recordset);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function actualizarCompetencia() {
  console.log('\n--- Actualizar competencia ---\n');
  
  const id = await question('ID de la competencia a actualizar: ');
  const nuevoNombre = await question('Nuevo nombre (dejar en blanco para no cambiar): ');
  const nuevasHoras = await question('Nuevas horas (dejar en blanco para no cambiar): ');

  try {
    const request = pool.request();
    request.input('id_competencia', sql.Int, parseInt(id));

    let query = 'UPDATE competencias SET';
    const campos = [];

    if (nuevoNombre) {
      request.input('nombre', sql.VarChar(255), nuevoNombre);
      campos.push('nombre = @nombre');
    }

    if (nuevasHoras) {
      request.input('duracion_horas', sql.Int, parseInt(nuevasHoras));
      campos.push('duracion_horas = @duracion_horas');
    }

    if (campos.length === 0) {
      console.log('❌ No hay cambios para aplicar\n');
      return;
    }

    query += ' ' + campos.join(', ') + ' WHERE id_competencia = @id_competencia';

    await request.query(query);
    console.log(`\n✅ Competencia actualizada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function eliminarCompetencia() {
  console.log('\n--- Eliminar competencia ---\n');
  
  const id = await question('ID de la competencia a eliminar: ');
  const confirmar = await question('¿Estás seguro? (s/n): ');

  if (confirmar.toLowerCase() !== 's') {
    console.log('Operación cancelada.\n');
    await question('Presiona Enter para continuar...');
    return;
  }

  try {
    const request = pool.request();
    request.input('id_competencia', sql.Int, parseInt(id));

    await request.query('UPDATE competencias SET activo = 0 WHERE id_competencia = @id_competencia');
    console.log(`\n✅ Competencia eliminada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

// PROGRAMAS
async function menuProgramas() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('             GESTIÓN DE PROGRAMAS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('¿Qué acción deseas realizar?\n');
  console.log('1. ➕ Crear programa');
  console.log('2. 📋 Listar programas');
  console.log('3. ✏️  Actualizar programa');
  console.log('4. 🗑️  Eliminar programa');
  console.log('5. ⬅️  Volver al menú principal\n');

  const opcion = await question('Selecciona una opción (1-5): ');
  
  switch (opcion) {
    case '1':
      await crearPrograma();
      break;
    case '2':
      await listarProgramas();
      break;
    case '3':
      await actualizarPrograma();
      break;
    case '4':
      await eliminarPrograma();
      break;
    case '5':
      return;
    default:
      console.log('❌ Opción no válida');
  }

  await menuProgramas();
}

async function crearPrograma() {
  console.log('\n--- Crear nuevo programa ---\n');
  
  const nombre = await question('Nombre del programa: ');
  const codigo = await question('Código (ej: TSI): ');
  const tipo = await question('Tipo (tecnico/tecnologia/asistente): ');
  const trimestres = await question('Duración en trimestres: ');
  const oferta = await question('Tipo de oferta (abierta/cerrada/encadenamiento): ');

  try {
    const request = pool.request();
    request.input('nombre', sql.VarChar(255), nombre);
    request.input('codigo', sql.VarChar(50), codigo);
    request.input('tipo', sql.VarChar(50), tipo || 'tecnico');
    request.input('duracion_trimestres', sql.Int, parseInt(trimestres) || 4);
    request.input('tipo_oferta', sql.VarChar(50), oferta || 'abierta');

    await request.query(
      `INSERT INTO programas (nombre, codigo, tipo, duracion_trimestres, tipo_oferta, activo, fecha_creacion)
       VALUES (@nombre, @codigo, @tipo, @duracion_trimestres, @tipo_oferta, 1, GETDATE())`
    );

    console.log(`\n✅ Programa '${nombre}' creado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function listarProgramas() {
  console.log('\n--- Listado de programas ---\n');

  try {
    const result = await pool.request().query(
      'SELECT id_programa, nombre, codigo, tipo, duracion_trimestres, tipo_oferta, activo FROM programas ORDER BY fecha_creacion DESC'
    );

    if (result.recordset.length === 0) {
      console.log('No hay programas registrados.\n');
    } else {
      console.table(result.recordset);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function actualizarPrograma() {
  console.log('\n--- Actualizar programa ---\n');
  
  const id = await question('ID del programa a actualizar: ');
  const nuevoNombre = await question('Nuevo nombre (dejar en blanco para no cambiar): ');
  const nuevoTipo = await question('Nuevo tipo (dejar en blanco para no cambiar): ');

  try {
    const request = pool.request();
    request.input('id_programa', sql.Int, parseInt(id));

    let query = 'UPDATE programas SET';
    const campos = [];

    if (nuevoNombre) {
      request.input('nombre', sql.VarChar(255), nuevoNombre);
      campos.push('nombre = @nombre');
    }

    if (nuevoTipo) {
      request.input('tipo', sql.VarChar(50), nuevoTipo);
      campos.push('tipo = @tipo');
    }

    if (campos.length === 0) {
      console.log('❌ No hay cambios para aplicar\n');
      return;
    }

    query += ' ' + campos.join(', ') + ' WHERE id_programa = @id_programa';

    await request.query(query);
    console.log(`\n✅ Programa actualizado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function eliminarPrograma() {
  console.log('\n--- Eliminar programa ---\n');
  
  const id = await question('ID del programa a eliminar: ');
  const confirmar = await question('¿Estás seguro? (s/n): ');

  if (confirmar.toLowerCase() !== 's') {
    console.log('Operación cancelada.\n');
    await question('Presiona Enter para continuar...');
    return;
  }

  try {
    const request = pool.request();
    request.input('id_programa', sql.Int, parseInt(id));

    await request.query('UPDATE programas SET activo = 0 WHERE id_programa = @id_programa');
    console.log(`\n✅ Programa eliminado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

// FICHAS
async function menuFichas() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('             GESTIÓN DE FICHAS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('¿Qué acción deseas realizar?\n');
  console.log('1. ➕ Crear ficha');
  console.log('2. 📋 Listar fichas');
  console.log('3. ✏️  Actualizar ficha');
  console.log('4. 🗑️  Eliminar ficha');
  console.log('5. ⬅️  Volver al menú principal\n');

  const opcion = await question('Selecciona una opción (1-5): ');
  
  switch (opcion) {
    case '1':
      await crearFicha();
      break;
    case '2':
      await listarFichas();
      break;
    case '3':
      await actualizarFicha();
      break;
    case '4':
      await eliminarFicha();
      break;
    case '5':
      return;
    default:
      console.log('❌ Opción no válida');
  }

  await menuFichas();
}

async function crearFicha() {
  console.log('\n--- Crear nueva ficha ---\n');
  
  const codigo = await question('Código de ficha (ej: FIC-2026-001): ');
  const id_programa = await question('ID del programa: ');
  const fecha_inicio = await question('Fecha de inicio (YYYY-MM-DD): ');
  const fecha_fin = await question('Fecha de fin (YYYY-MM-DD): ');

  try {
    const request = pool.request();
    request.input('codigo', sql.VarChar(100), codigo);
    request.input('id_programa', sql.Int, parseInt(id_programa));
    request.input('fecha_inicio', sql.Date, new Date(fecha_inicio));
    request.input('fecha_fin', sql.Date, new Date(fecha_fin));

    await request.query(
      `INSERT INTO fichas (codigo, id_programa, fecha_inicio, fecha_fin, activo, fecha_creacion)
       VALUES (@codigo, @id_programa, @fecha_inicio, @fecha_fin, 1, GETDATE())`
    );

    console.log(`\n✅ Ficha '${codigo}' creada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function listarFichas() {
  console.log('\n--- Listado de fichas ---\n');

  try {
    const result = await pool.request().query(
      `SELECT f.id_ficha, f.codigo, p.nombre as programa, f.fecha_inicio, f.fecha_fin, f.activo 
       FROM fichas f
       JOIN programas p ON f.id_programa = p.id_programa
       ORDER BY f.fecha_creacion DESC`
    );

    if (result.recordset.length === 0) {
      console.log('No hay fichas registradas.\n');
    } else {
      console.table(result.recordset);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function actualizarFicha() {
  console.log('\n--- Actualizar ficha ---\n');
  
  const id = await question('ID de la ficha a actualizar: ');
  const nuevaFechaFin = await question('Nueva fecha de fin (dejar en blanco para no cambiar, formato YYYY-MM-DD): ');

  try {
    const request = pool.request();
    request.input('id_ficha', sql.Int, parseInt(id));

    let query = 'UPDATE fichas SET';
    const campos = [];

    if (nuevaFechaFin) {
      request.input('fecha_fin', sql.Date, new Date(nuevaFechaFin));
      campos.push('fecha_fin = @fecha_fin');
    }

    if (campos.length === 0) {
      console.log('❌ No hay cambios para aplicar\n');
      return;
    }

    query += ' ' + campos.join(', ') + ' WHERE id_ficha = @id_ficha';

    await request.query(query);
    console.log(`\n✅ Ficha actualizada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function eliminarFicha() {
  console.log('\n--- Eliminar ficha ---\n');
  
  const id = await question('ID de la ficha a eliminar: ');
  const confirmar = await question('¿Estás seguro? (s/n): ');

  if (confirmar.toLowerCase() !== 's') {
    console.log('Operación cancelada.\n');
    await question('Presiona Enter para continuar...');
    return;
  }

  try {
    const request = pool.request();
    request.input('id_ficha', sql.Int, parseInt(id));

    await request.query('UPDATE fichas SET activo = 0 WHERE id_ficha = @id_ficha');
    console.log(`\n✅ Ficha eliminada exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

// DOCENTES
async function menuDocentes() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('             GESTIÓN DE DOCENTES');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('¿Qué acción deseas realizar?\n');
  console.log('1. ➕ Crear docente');
  console.log('2. 📋 Listar docentes');
  console.log('3. ✏️  Actualizar docente');
  console.log('4. 🗑️  Eliminar docente');
  console.log('5. ⬅️  Volver al menú principal\n');

  const opcion = await question('Selecciona una opción (1-5): ');
  
  switch (opcion) {
    case '1':
      await crearDocente();
      break;
    case '2':
      await listarDocentes();
      break;
    case '3':
      await actualizarDocente();
      break;
    case '4':
      await eliminarDocente();
      break;
    case '5':
      return;
    default:
      console.log('❌ Opción no válida');
  }

  await menuDocentes();
}

async function crearDocente() {
  console.log('\n--- Crear nuevo docente ---\n');
  
  const nombre = await question('Nombre y apellido: ');
  const documento = await question('Número de documento: ');
  const celular = await question('Celular (opcional): ');
  const correo = await question('Correo: ');

  try {
    const request = pool.request();
    request.input('nombre_apellido', sql.VarChar(255), nombre);
    request.input('numero_documento', sql.VarChar(20), documento);
    request.input('celular', sql.VarChar(20), celular || '');
    request.input('correo', sql.VarChar(255), correo);

    const result = await request.query(
      `INSERT INTO docentes (nombre_apellido, numero_documento, celular, correo, activo, fecha_creacion)
       OUTPUT INSERTED.id_docente
       VALUES (@nombre_apellido, @numero_documento, @celular, @correo, 1, GETDATE())`
    );

    console.log(`\n✅ Docente '${nombre}' creado exitosamente (ID: ${result.recordset[0].id_docente})\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function listarDocentes() {
  console.log('\n--- Listado de docentes ---\n');

  try {
    const result = await pool.request().query(
      'SELECT id_docente, nombre_apellido, numero_documento, celular, correo, activo FROM docentes ORDER BY fecha_creacion DESC'
    );

    if (result.recordset.length === 0) {
      console.log('No hay docentes registrados.\n');
    } else {
      console.table(result.recordset);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function actualizarDocente() {
  console.log('\n--- Actualizar docente ---\n');
  
  const id = await question('ID del docente a actualizar: ');
  const nuevoNombre = await question('Nuevo nombre (dejar en blanco para no cambiar): ');
  const nuevoCelular = await question('Nuevo celular (dejar en blanco para no cambiar): ');
  const nuevoCorreo = await question('Nuevo correo (dejar en blanco para no cambiar): ');

  try {
    const request = pool.request();
    request.input('id_docente', sql.Int, parseInt(id));

    let query = 'UPDATE docentes SET';
    const campos = [];

    if (nuevoNombre) {
      request.input('nombre_apellido', sql.VarChar(255), nuevoNombre);
      campos.push('nombre_apellido = @nombre_apellido');
    }

    if (nuevoCelular) {
      request.input('celular', sql.VarChar(20), nuevoCelular);
      campos.push('celular = @celular');
    }

    if (nuevoCorreo) {
      request.input('correo', sql.VarChar(255), nuevoCorreo);
      campos.push('correo = @correo');
    }

    if (campos.length === 0) {
      console.log('❌ No hay cambios para aplicar\n');
      return;
    }

    query += ' ' + campos.join(', ') + ' WHERE id_docente = @id_docente';

    await request.query(query);
    console.log(`\n✅ Docente actualizado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

async function eliminarDocente() {
  console.log('\n--- Eliminar docente ---\n');
  
  const id = await question('ID del docente a eliminar: ');
  const confirmar = await question('¿Estás seguro? (s/n): ');

  if (confirmar.toLowerCase() !== 's') {
    console.log('Operación cancelada.\n');
    await question('Presiona Enter para continuar...');
    return;
  }

  try {
    const request = pool.request();
    request.input('id_docente', sql.Int, parseInt(id));

    await request.query('UPDATE docentes SET activo = 0 WHERE id_docente = @id_docente');
    console.log(`\n✅ Docente eliminado exitosamente\n`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
  }

  await question('Presiona Enter para continuar...');
}

// Función principal
async function main() {
  try {
    console.log('🔐 Conectando a la base de datos...\n');
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado exitosamente\n');

    let continuar = true;
    while (continuar) {
      const opcion = await menuPrincipal();

      switch (opcion) {
        case '1':
          await menuUsuarios();
          break;
        case '2':
          await menuCompetencias();
          break;
        case '3':
          await menuProgramas();
          break;
        case '4':
          await menuFichas();
          break;
        case '5':
          await menuDocentes();
          break;
        case '6':
          console.log('\n👋 ¡Hasta luego!\n');
          continuar = false;
          break;
        default:
          console.log('❌ Opción no válida');
          await question('Presiona Enter para continuar...');
      }
    }

    rl.close();
    if (pool) {
      await pool.close();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
