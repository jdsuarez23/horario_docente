// =============================================
// Modelos de Base de Datos - Queries
// =============================================

const queries = {
  // Usuarios
  usuarios: {
    getByUsername: `
      SELECT 
        u.id_usuario,
        u.username,
        u.password_hash,
        u.rol,
        u.id_docente,
        d.nombre_apellido AS docente_nombre,
        d.numero_documento AS docente_documento,
        u.activo
      FROM usuarios u
      LEFT JOIN docentes d ON u.id_docente = d.id_docente
      WHERE u.username = @username AND u.activo = 1
    `,
    create: `
      INSERT INTO usuarios (username, password_hash, rol, id_docente)
      OUTPUT INSERTED.id_usuario, INSERTED.username, INSERTED.rol, INSERTED.id_docente
      VALUES (@username, @password_hash, @rol, @id_docente)
    `,
    update: `
      UPDATE usuarios 
      SET username = @username, rol = @rol, id_docente = @id_docente, activo = @activo
      OUTPUT INSERTED.*
      WHERE id_usuario = @id_usuario
    `,
    delete: `
      UPDATE usuarios SET activo = 0 WHERE id_usuario = @id_usuario
    `,
    getAll: `
      SELECT 
        u.id_usuario,
        u.username,
        u.rol,
        u.id_docente,
        d.nombre_apellido AS docente_nombre,
        u.fecha_creacion,
        u.activo
      FROM usuarios u
      LEFT JOIN docentes d ON u.id_docente = d.id_docente
      WHERE u.activo = 1
      ORDER BY u.fecha_creacion DESC
    `
  },

  // Docentes
  docentes: {
    getAll: `
      SELECT 
        d.id_docente,
        d.nombre_apellido,
        d.numero_documento,
        d.celular,
        d.correo,
        d.fecha_registro,
        d.activo,
        COUNT(h.id_horario) AS total_horarios
      FROM docentes d
      LEFT JOIN horarios h ON d.id_docente = h.id_docente AND h.activo = 1
      WHERE d.activo = 1
      GROUP BY d.id_docente, d.nombre_apellido, d.numero_documento, 
               d.celular, d.correo, d.fecha_registro, d.activo
      ORDER BY d.nombre_apellido
    `,
    getById: `
      SELECT * FROM docentes WHERE id_docente = @id_docente AND activo = 1
    `,
    create: `
      INSERT INTO docentes (nombre_apellido, numero_documento, celular, correo)
      OUTPUT INSERTED.*
      VALUES (@nombre_apellido, @numero_documento, @celular, @correo)
    `,
    update: `
      UPDATE docentes 
      SET nombre_apellido = @nombre_apellido, 
          numero_documento = @numero_documento, 
          celular = @celular, 
          correo = @correo,
          activo = @activo
      OUTPUT INSERTED.*
      WHERE id_docente = @id_docente
    `,
    delete: `
      UPDATE docentes SET activo = 0 WHERE id_docente = @id_docente
    `,
    search: `
      SELECT 
        d.id_docente,
        d.nombre_apellido,
        d.numero_documento,
        d.celular,
        d.correo,
        d.fecha_registro,
        d.activo,
        COUNT(h.id_horario) AS total_horarios
      FROM docentes d
      LEFT JOIN horarios h ON d.id_docente = h.id_docente AND h.activo = 1
      WHERE d.activo = 1
        AND (d.nombre_apellido LIKE '%' + @termino + '%'
             OR d.numero_documento LIKE '%' + @termino + '%'
             OR d.correo LIKE '%' + @termino + '%')
      GROUP BY d.id_docente, d.nombre_apellido, d.numero_documento, 
               d.celular, d.correo, d.fecha_registro, d.activo
      ORDER BY d.nombre_apellido
    `
  },

  // Competencias
  competencias: {
    getAll: `
      SELECT 
        c.id_competencia,
        c.nombre,
        c.codigo,
        c.duracion_horas,
        c.fecha_registro,
        c.activo,
        COUNT(dc.id_docente) AS total_docentes
      FROM competencias c
      LEFT JOIN docente_competencia dc ON c.id_competencia = dc.id_competencia
      WHERE c.activo = 1
      GROUP BY c.id_competencia, c.nombre, c.codigo, c.duracion_horas, c.fecha_registro, c.activo
      ORDER BY c.nombre
    `,
    getById: `
      SELECT * FROM competencias WHERE id_competencia = @id_competencia AND activo = 1
    `,
    create: `
      INSERT INTO competencias (nombre, codigo, duracion_horas)
      OUTPUT INSERTED.*
      VALUES (@nombre, @codigo, @duracion_horas)
    `,
    update: `
      UPDATE competencias 
      SET nombre = @nombre, codigo = @codigo, duracion_horas = @duracion_horas, activo = @activo
      OUTPUT INSERTED.*
      WHERE id_competencia = @id_competencia
    `,
    delete: `
      UPDATE competencias SET activo = 0 WHERE id_competencia = @id_competencia
    `
  },

  // Programas
  programas: {
    getAll: `
      SELECT 
        p.id_programa,
        p.nombre,
        p.codigo,
        p.tipo,
        p.duracion_trimestres,
        p.tipo_oferta,
        p.fecha_registro,
        p.activo,
        COUNT(f.id_ficha) AS total_fichas
      FROM programas p
      LEFT JOIN fichas f ON p.id_programa = f.id_programa AND f.activo = 1
      WHERE p.activo = 1
      GROUP BY p.id_programa, p.nombre, p.codigo, p.tipo, p.duracion_trimestres, 
               p.tipo_oferta, p.fecha_registro, p.activo
      ORDER BY p.nombre
    `,
    getById: `
      SELECT * FROM programas WHERE id_programa = @id_programa AND activo = 1
    `,
    create: `
      INSERT INTO programas (nombre, codigo, tipo, duracion_trimestres, tipo_oferta)
      OUTPUT INSERTED.*
      VALUES (@nombre, @codigo, @tipo, @duracion_trimestres, @tipo_oferta)
    `,
    update: `
      UPDATE programas 
      SET nombre = @nombre, codigo = @codigo, tipo = @tipo, 
          duracion_trimestres = @duracion_trimestres, tipo_oferta = @tipo_oferta, activo = @activo
      OUTPUT INSERTED.*
      WHERE id_programa = @id_programa
    `,
    delete: `
      UPDATE programas SET activo = 0 WHERE id_programa = @id_programa
    `
  },

  // Fichas
  fichas: {
    getAll: `
      SELECT 
        f.id_ficha,
        f.codigo,
        f.id_programa,
        p.nombre AS programa_nombre,
        p.codigo AS programa_codigo,
        p.tipo AS programa_tipo,
        f.fecha_inicio,
        f.fecha_fin,
        f.fecha_registro,
        f.activo,
        COUNT(h.id_horario) AS total_horarios
      FROM fichas f
      INNER JOIN programas p ON f.id_programa = p.id_programa
      LEFT JOIN horarios h ON f.id_ficha = h.id_ficha AND h.activo = 1
      WHERE f.activo = 1
      GROUP BY f.id_ficha, f.codigo, f.id_programa, p.nombre, p.codigo, 
               p.tipo, f.fecha_inicio, f.fecha_fin, f.fecha_registro, f.activo
      ORDER BY f.codigo
    `,
    getById: `
      SELECT * FROM fichas WHERE id_ficha = @id_ficha AND activo = 1
    `,
    create: `
      INSERT INTO fichas (codigo, id_programa, fecha_inicio, fecha_fin)
      OUTPUT INSERTED.*
      VALUES (@codigo, @id_programa, @fecha_inicio, @fecha_fin)
    `,
    update: `
      UPDATE fichas 
      SET codigo = @codigo, id_programa = @id_programa, 
          fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin, activo = @activo
      OUTPUT INSERTED.*
      WHERE id_ficha = @id_ficha
    `,
    delete: `
      UPDATE fichas SET activo = 0 WHERE id_ficha = @id_ficha
    `,
    search: `
      SELECT 
        f.id_ficha,
        f.codigo,
        f.id_programa,
        p.nombre AS programa_nombre,
        p.codigo AS programa_codigo,
        p.tipo AS programa_tipo,
        f.fecha_inicio,
        f.fecha_fin,
        f.activo,
        COUNT(h.id_horario) AS total_horarios
      FROM fichas f
      INNER JOIN programas p ON f.id_programa = p.id_programa
      LEFT JOIN horarios h ON f.id_ficha = h.id_ficha AND h.activo = 1
      WHERE f.activo = 1
        AND f.codigo LIKE '%' + @termino + '%'
      GROUP BY f.id_ficha, f.codigo, f.id_programa, p.nombre, p.codigo, 
               p.tipo, f.fecha_inicio, f.fecha_fin, f.activo
      ORDER BY f.codigo
    `
  },

  // Salones
  salones: {
    getAll: `
      SELECT 
        s.id_salon,
        s.nombre,
        s.numero,
        s.capacidad,
        s.ubicacion,
        s.fecha_registro,
        s.activo,
        COUNT(h.id_horario) AS total_horarios
      FROM salones s
      LEFT JOIN horarios h ON s.id_salon = h.id_salon AND h.activo = 1
      WHERE s.activo = 1
      GROUP BY s.id_salon, s.nombre, s.numero, s.capacidad, s.ubicacion, s.fecha_registro, s.activo
      ORDER BY s.nombre
    `,
    getById: `
      SELECT * FROM salones WHERE id_salon = @id_salon AND activo = 1
    `,
    create: `
      INSERT INTO salones (nombre, numero, capacidad, ubicacion)
      OUTPUT INSERTED.*
      VALUES (@nombre, @numero, @capacidad, @ubicacion)
    `,
    update: `
      UPDATE salones 
      SET nombre = @nombre, numero = @numero, capacidad = @capacidad, ubicacion = @ubicacion, activo = @activo
      OUTPUT INSERTED.*
      WHERE id_salon = @id_salon
    `,
    delete: `
      UPDATE salones SET activo = 0 WHERE id_salon = @id_salon
    `
  },

  // Horarios
  horarios: {
    getAll: `
      SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        h.id_docente,
        d.nombre_apellido AS docente_nombre,
        h.id_ficha,
        f.codigo AS ficha_codigo,
        h.id_salon,
        s.nombre AS salon_nombre,
        s.numero AS salon_numero,
        h.id_competencia,
        c.nombre AS competencia_nombre,
        h.fecha_registro
      FROM horarios h
      INNER JOIN docentes d ON h.id_docente = d.id_docente
      INNER JOIN fichas f ON h.id_ficha = f.id_ficha
      INNER JOIN salones s ON h.id_salon = s.id_salon
      INNER JOIN competencias c ON h.id_competencia = c.id_competencia
      WHERE h.activo = 1
      ORDER BY h.dia, h.hora_inicio
    `,
    getById: `
      SELECT * FROM horarios WHERE id_horario = @id_horario AND activo = 1
    `,
    create: `
      INSERT INTO horarios (dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia)
      OUTPUT INSERTED.*
      VALUES (@dia, @hora_inicio, @hora_fin, @id_docente, @id_ficha, @id_salon, @id_competencia)
    `,
    update: `
      UPDATE horarios 
      SET dia = @dia, 
          hora_inicio = @hora_inicio, 
          hora_fin = @hora_fin, 
          id_docente = @id_docente, 
          id_ficha = @id_ficha, 
          id_salon = @id_salon, 
          id_competencia = @id_competencia
      OUTPUT INSERTED.*
      WHERE id_horario = @id_horario
    `,
    delete: `
      UPDATE horarios SET activo = 0 WHERE id_horario = @id_horario
    `,
    getByDocente: `
      SELECT * FROM horarios WHERE id_docente = @id_docente AND activo = 1 ORDER BY dia, hora_inicio
    `,
    getByFicha: `
      SELECT * FROM horarios WHERE id_ficha = @id_ficha AND activo = 1 ORDER BY dia, hora_inicio
    `,
    getBySalon: `
      SELECT * FROM horarios WHERE id_salon = @id_salon AND activo = 1 ORDER BY dia, hora_inicio
    `
  },

  // Ruta Formativa
  rutasFormativas: {
    getByPrograma: `
      SELECT 
        rf.id_ruta,
        rf.id_programa,
        p.nombre AS programa_nombre,
        rf.id_competencia,
        c.nombre AS competencia_nombre,
        c.codigo AS competencia_codigo,
        rf.trimestre,
        rf.fecha_creacion
      FROM ruta_formativa rf
      INNER JOIN programas p ON rf.id_programa = p.id_programa
      INNER JOIN competencias c ON rf.id_competencia = c.id_competencia
      WHERE rf.id_programa = @id_programa
      ORDER BY rf.trimestre, c.nombre
    `,
    create: `
      INSERT INTO ruta_formativa (id_programa, id_competencia, trimestre)
      OUTPUT INSERTED.*
      VALUES (@id_programa, @id_competencia, @trimestre)
    `,
    delete: `
      DELETE FROM ruta_formativa WHERE id_ruta = @id_ruta
    `
  },

  // Docente-Competencia
  docenteCompetencia: {
    getByDocente: `
      SELECT 
        dc.id_docente,
        dc.id_competencia,
        c.nombre AS competencia_nombre,
        c.codigo AS competencia_codigo,
        c.duracion_horas,
        dc.fecha_asignacion
      FROM docente_competencia dc
      INNER JOIN competencias c ON dc.id_competencia = c.id_competencia
      WHERE dc.id_docente = @id_docente
      ORDER BY c.nombre
    `,
    create: `
      INSERT INTO docente_competencia (id_docente, id_competencia)
      VALUES (@id_docente, @id_competencia)
    `,
    delete: `
      DELETE FROM docente_competencia 
      WHERE id_docente = @id_docente AND id_competencia = @id_competencia
    `
  }
};

module.exports = { queries };