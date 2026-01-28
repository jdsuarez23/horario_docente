-- =============================================
-- Sistema de Gestión de Horarios Académicos - SENA
-- Procedimientos almacenados y funciones
-- =============================================

USE SENA_Horarios;
GO

-- =============================================
-- Procedimiento: sp_obtener_horarios_completos
-- Descripción: Obtiene todos los horarios con información relacionada
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_horarios_completos' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_horarios_completos;
GO

CREATE PROCEDURE sp_obtener_horarios_completos
    @id_docente INT = NULL,
    @id_ficha INT = NULL,
    @id_salon INT = NULL,
    @dia VARCHAR(15) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        h.id_docente,
        d.nombre_apellido AS docente_nombre,
        d.numero_documento AS docente_documento,
        h.id_ficha,
        f.codigo AS ficha_codigo,
        h.id_salon,
        s.nombre AS salon_nombre,
        s.numero AS salon_numero,
        h.id_competencia,
        c.nombre AS competencia_nombre,
        c.codigo AS competencia_codigo,
        p.id_programa,
        p.nombre AS programa_nombre,
        p.tipo AS programa_tipo,
        h.fecha_registro
    FROM horarios h
    INNER JOIN docentes d ON h.id_docente = d.id_docente
    INNER JOIN fichas f ON h.id_ficha = f.id_ficha
    INNER JOIN salones s ON h.id_salon = s.id_salon
    INNER JOIN competencias c ON h.id_competencia = c.id_competencia
    INNER JOIN programas p ON f.id_programa = p.id_programa
    WHERE h.activo = 1
        AND (@id_docente IS NULL OR h.id_docente = @id_docente)
        AND (@id_ficha IS NULL OR h.id_ficha = @id_ficha)
        AND (@id_salon IS NULL OR h.id_salon = @id_salon)
        AND (@dia IS NULL OR h.dia = @dia)
    ORDER BY h.dia, h.hora_inicio;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_horario_por_id
-- Descripción: Obtiene un horario específico con toda su información
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_horario_por_id' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_horario_por_id;
GO

CREATE PROCEDURE sp_obtener_horario_por_id
    @id_horario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        h.id_docente,
        d.nombre_apellido AS docente_nombre,
        d.numero_documento AS docente_documento,
        d.celular AS docente_celular,
        d.correo AS docente_correo,
        h.id_ficha,
        f.codigo AS ficha_codigo,
        f.fecha_inicio,
        f.fecha_fin,
        h.id_salon,
        s.nombre AS salon_nombre,
        s.numero AS salon_numero,
        s.capacidad AS salon_capacidad,
        s.ubicacion AS salon_ubicacion,
        h.id_competencia,
        c.nombre AS competencia_nombre,
        c.codigo AS competencia_codigo,
        c.duracion_horas AS competencia_duracion,
        p.id_programa,
        p.nombre AS programa_nombre,
        p.tipo AS programa_tipo,
        p.codigo AS programa_codigo,
        h.fecha_registro
    FROM horarios h
    INNER JOIN docentes d ON h.id_docente = d.id_docente
    INNER JOIN fichas f ON h.id_ficha = f.id_ficha
    INNER JOIN salones s ON h.id_salon = s.id_salon
    INNER JOIN competencias c ON h.id_competencia = c.id_competencia
    INNER JOIN programas p ON f.id_programa = p.id_programa
    WHERE h.id_horario = @id_horario AND h.activo = 1;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_docentes_con_competencias
-- Descripción: Obtiene todos los docentes con sus competencias
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_docentes_con_competencias' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_docentes_con_competencias;
GO

CREATE PROCEDURE sp_obtener_docentes_con_competencias
    @id_docente INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        d.id_docente,
        d.nombre_apellido,
        d.numero_documento,
        d.celular,
        d.correo,
        d.fecha_registro,
        d.activo,
        c.id_competencia,
        c.nombre AS competencia_nombre,
        c.codigo AS competencia_codigo,
        c.duracion_horas AS competencia_duracion,
        dc.fecha_asignacion
    FROM docentes d
    LEFT JOIN docente_competencia dc ON d.id_docente = dc.id_docente
    LEFT JOIN competencias c ON dc.id_competencia = c.id_competencia
    WHERE d.activo = 1
        AND (@id_docente IS NULL OR d.id_docente = @id_docente)
    ORDER BY d.nombre_apellido, c.nombre;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_fichas_completas
-- Descripción: Obtiene fichas con programa y conteo de horarios
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_fichas_completas' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_fichas_completas;
GO

CREATE PROCEDURE sp_obtener_fichas_completas
    @id_ficha INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        f.id_ficha,
        f.codigo,
        f.id_programa,
        p.nombre AS programa_nombre,
        p.codigo AS programa_codigo,
        p.tipo AS programa_tipo,
        p.tipo_oferta AS programa_tipo_oferta,
        f.fecha_inicio,
        f.fecha_fin,
        f.fecha_registro,
        f.activo,
        COUNT(h.id_horario) AS total_horarios
    FROM fichas f
    INNER JOIN programas p ON f.id_programa = p.id_programa
    LEFT JOIN horarios h ON f.id_ficha = h.id_ficha AND h.activo = 1
    WHERE f.activo = 1
        AND (@id_ficha IS NULL OR f.id_ficha = @id_ficha)
    GROUP BY f.id_ficha, f.codigo, f.id_programa, p.nombre, p.codigo, 
             p.tipo, p.tipo_oferta, f.fecha_inicio, f.fecha_fin, f.fecha_registro, f.activo
    ORDER BY f.codigo;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_horarios_por_docente
-- Descripción: Obtiene el horario semanal de un docente
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_horarios_por_docente' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_horarios_por_docente;
GO

CREATE PROCEDURE sp_obtener_horarios_por_docente
    @id_docente INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        f.codigo AS ficha_codigo,
        s.nombre AS salon_nombre,
        s.numero AS salon_numero,
        c.nombre AS competencia_nombre,
        p.nombre AS programa_nombre
    FROM horarios h
    INNER JOIN fichas f ON h.id_ficha = f.id_ficha
    INNER JOIN salones s ON h.id_salon = s.id_salon
    INNER JOIN competencias c ON h.id_competencia = c.id_competencia
    INNER JOIN programas p ON f.id_programa = p.id_programa
    WHERE h.id_docente = @id_docente AND h.activo = 1
    ORDER BY 
        CASE h.dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
        END,
        h.hora_inicio;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_horarios_por_ficha
-- Descripción: Obtiene el horario semanal de una ficha
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_horarios_por_ficha' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_horarios_por_ficha;
GO

CREATE PROCEDURE sp_obtener_horarios_por_ficha
    @id_ficha INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        d.nombre_apellido AS docente_nombre,
        s.nombre AS salon_nombre,
        s.numero AS salon_numero,
        c.nombre AS competencia_nombre,
        p.nombre AS programa_nombre
    FROM horarios h
    INNER JOIN docentes d ON h.id_docente = d.id_docente
    INNER JOIN fichas f ON h.id_ficha = f.id_ficha
    INNER JOIN programas p ON f.id_programa = p.id_programa
    INNER JOIN salones s ON h.id_salon = s.id_salon
    INNER JOIN competencias c ON h.id_competencia = c.id_competencia
    WHERE h.id_ficha = @id_ficha
      AND h.activo = 1
    ORDER BY 
        CASE h.dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
        END,
        h.hora_inicio;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_horarios_por_salon
-- Descripción: Obtiene el horario semanal de un salón
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_horarios_por_salon' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_horarios_por_salon;
GO

CREATE PROCEDURE sp_obtener_horarios_por_salon
    @id_salon INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.id_horario,
        h.dia,
        CONVERT(VARCHAR(5), h.hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), h.hora_fin, 108) AS hora_fin,
        d.nombre_apellido AS docente_nombre,
        f.codigo AS ficha_codigo,
        c.nombre AS competencia_nombre,
        p.nombre AS programa_nombre
    FROM horarios h
    INNER JOIN docentes d ON h.id_docente = d.id_docente
    INNER JOIN fichas f ON h.id_ficha = f.id_ficha
    INNER JOIN competencias c ON h.id_competencia = c.id_competencia
    INNER JOIN programas p ON f.id_programa = p.id_programa
    WHERE h.id_salon = @id_salon AND h.activo = 1
    ORDER BY 
        CASE h.dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
        END,
        h.hora_inicio;
END
GO

-- =============================================
-- Procedimiento: sp_buscar_docentes
-- Descripción: Busca docentes por nombre o documento
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_buscar_docentes' AND xtype = 'P')
    DROP PROCEDURE sp_buscar_docentes;
GO

CREATE PROCEDURE sp_buscar_docentes
    @termino VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
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
        AND (
            d.nombre_apellido LIKE '%' + @termino + '%'
            OR d.numero_documento LIKE '%' + @termino + '%'
            OR d.correo LIKE '%' + @termino + '%'
        )
    GROUP BY d.id_docente, d.nombre_apellido, d.numero_documento, 
             d.celular, d.correo, d.fecha_registro, d.activo
    ORDER BY d.nombre_apellido;
END
GO

-- =============================================
-- Procedimiento: sp_buscar_fichas
-- Descripción: Busca fichas por código
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_buscar_fichas' AND xtype = 'P')
    DROP PROCEDURE sp_buscar_fichas;
GO

CREATE PROCEDURE sp_buscar_fichas
    @termino VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
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
    ORDER BY f.codigo;
END
GO

-- =============================================
-- Procedimiento: sp_validar_disponibilidad_horario
-- Descripción: Valida si un horario está disponible
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_validar_disponibilidad_horario' AND xtype = 'P')
    DROP PROCEDURE sp_validar_disponibilidad_horario;
GO

CREATE PROCEDURE sp_validar_disponibilidad_horario
    @id_horario INT = NULL,
    @id_docente INT,
    @id_salon INT,
    @id_ficha INT,
    @dia VARCHAR(15),
    @hora_inicio TIME,
    @hora_fin TIME
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @cruce BIT;
    
    -- Usar la función para validar cruces
    SELECT @cruce = dbo.fn_validar_cruce_horario(@id_horario, @id_docente, @id_salon, @id_ficha, @dia, @hora_inicio, @hora_fin);
    
    SELECT 
        @cruce AS existe_cruce,
        CASE 
            WHEN @cruce = 1 THEN 'Existe un cruce de horario con el docente, salón o ficha especificados'
            ELSE 'El horario está disponible'
        END AS mensaje;
END
GO

-- =============================================
-- Procedimiento: sp_obtener_dashboard_admin
-- Descripción: Obtiene estadísticas para el dashboard administrativo
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_obtener_dashboard_admin' AND xtype = 'P')
    DROP PROCEDURE sp_obtener_dashboard_admin;
GO

CREATE PROCEDURE sp_obtener_dashboard_admin
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Estadísticas generales
    SELECT 
        (SELECT COUNT(*) FROM docentes WHERE activo = 1) AS total_docentes,
        (SELECT COUNT(*) FROM fichas WHERE activo = 1) AS total_fichas,
        (SELECT COUNT(*) FROM salones WHERE activo = 1) AS total_salones,
        (SELECT COUNT(*) FROM horarios WHERE activo = 1) AS total_horarios,
        (SELECT COUNT(*) FROM programas WHERE activo = 1) AS total_programas,
        (SELECT COUNT(*) FROM competencias WHERE activo = 1) AS total_competencias;
    
    -- Horarios por día
    SELECT 
        dia,
        COUNT(*) AS total_horarios
    FROM horarios 
    WHERE activo = 1
    GROUP BY dia
    ORDER BY 
        CASE dia 
            WHEN 'lunes' THEN 1 
            WHEN 'martes' THEN 2 
            WHEN 'miercoles' THEN 3 
            WHEN 'jueves' THEN 4 
            WHEN 'viernes' THEN 5 
            WHEN 'sabado' THEN 6 
        END;
    
    -- Salones más ocupados
    SELECT TOP 5
        s.id_salon,
        s.nombre,
        s.numero,
        COUNT(h.id_horario) AS total_horarios
    FROM salones s
    LEFT JOIN horarios h ON s.id_salon = h.id_salon AND h.activo = 1
    WHERE s.activo = 1
    GROUP BY s.id_salon, s.nombre, s.numero
    ORDER BY total_horarios DESC;
    
    -- Docentes con más horarios
    SELECT TOP 5
        d.id_docente,
        d.nombre_apellido,
        COUNT(h.id_horario) AS total_horarios
    FROM docentes d
    LEFT JOIN horarios h ON d.id_docente = h.id_docente AND h.activo = 1
    WHERE d.activo = 1
    GROUP BY d.id_docente, d.nombre_apellido
    ORDER BY total_horarios DESC;
END
GO

-- =============================================
-- Procedimiento: sp_login_usuario
-- Descripción: Valida credenciales de usuario
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'sp_login_usuario' AND xtype = 'P')
    DROP PROCEDURE sp_login_usuario;
GO

CREATE PROCEDURE sp_login_usuario
    @username VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
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
    WHERE u.username = @username AND u.activo = 1;
END
GO

PRINT '✅ Procedimientos almacenados creados exitosamente';
