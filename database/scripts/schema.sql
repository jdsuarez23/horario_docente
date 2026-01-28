-- =============================================
-- Sistema de Gestión de Horarios Académicos - SENA
-- Script de creación de base de datos y tablas
-- =============================================

-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SENA_Horarios')
BEGIN
    CREATE DATABASE SENA_Horarios;
END
GO

-- Usar la base de datos
USE SENA_Horarios;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'docentes' AND xtype = 'U')
BEGIN
    CREATE TABLE docentes (
        id_docente INT IDENTITY(1,1) PRIMARY KEY,
        nombre_apellido VARCHAR(100) NOT NULL,
        numero_documento VARCHAR(20) UNIQUE NOT NULL,
        celular VARCHAR(20),
        correo VARCHAR(100) UNIQUE,
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: usuarios
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'usuarios' AND xtype = 'U')
BEGIN
    CREATE TABLE usuarios (
        id_usuario INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('admin', 'coordinador', 'docente')) NOT NULL,
        id_docente INT NULL,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1,
        
        -- Foreign key
        FOREIGN KEY (id_docente) REFERENCES docentes(id_docente) ON DELETE SET NULL
    );
END
GO

-- =============================================
-- Tabla: docentes
-- =============================================

-- =============================================
-- Tabla: competencias
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'competencias' AND xtype = 'U')
BEGIN
    CREATE TABLE competencias (
        id_competencia INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        duracion_horas INT DEFAULT 0,
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: docente_competencia (relación muchos a muchos)
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'docente_competencia' AND xtype = 'U')
BEGIN
    CREATE TABLE docente_competencia (
        id_docente INT NOT NULL,
        id_competencia INT NOT NULL,
        fecha_asignacion DATETIME DEFAULT GETDATE(),
        
        -- Primary key compuesta
        PRIMARY KEY (id_docente, id_competencia),
        
        -- Foreign keys
        FOREIGN KEY (id_docente) REFERENCES docentes(id_docente) ON DELETE CASCADE,
        FOREIGN KEY (id_competencia) REFERENCES competencias(id_competencia) ON DELETE CASCADE
    );
END
GO

-- =============================================
-- Tabla: programas
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'programas' AND xtype = 'U')
BEGIN
    CREATE TABLE programas (
        id_programa INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        tipo VARCHAR(20) CHECK (tipo IN ('tecnico', 'tecnologia', 'asistente')) NOT NULL,
        duracion_trimestres INT DEFAULT 4,
        tipo_oferta VARCHAR(20) CHECK (tipo_oferta IN ('abierta', 'cerrada', 'encadenamiento')) DEFAULT 'abierta',
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: ruta_formativa
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'ruta_formativa' AND xtype = 'U')
BEGIN
    CREATE TABLE ruta_formativa (
        id_ruta INT IDENTITY(1,1) PRIMARY KEY,
        id_programa INT NOT NULL,
        id_competencia INT NOT NULL,
        trimestre INT DEFAULT 1,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        
        -- Foreign keys
        FOREIGN KEY (id_programa) REFERENCES programas(id_programa) ON DELETE CASCADE,
        FOREIGN KEY (id_competencia) REFERENCES competencias(id_competencia) ON DELETE CASCADE
    );
END
GO

-- =============================================
-- Tabla: fichas
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'fichas' AND xtype = 'U')
BEGIN
    CREATE TABLE fichas (
        id_ficha INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        id_programa INT NOT NULL,
        fecha_inicio DATE,
        fecha_fin DATE,
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1,
        
        -- Foreign key
        FOREIGN KEY (id_programa) REFERENCES programas(id_programa) ON DELETE CASCADE
    );
END
GO

-- =============================================
-- Tabla: salones
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'salones' AND xtype = 'U')
BEGIN
    CREATE TABLE salones (
        id_salon INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        numero VARCHAR(10),
        capacidad INT DEFAULT 30,
        ubicacion VARCHAR(100),
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: horarios
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'horarios' AND xtype = 'U')
BEGIN
    CREATE TABLE horarios (
        id_horario INT IDENTITY(1,1) PRIMARY KEY,
        dia VARCHAR(15) CHECK (dia IN ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado')) NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        id_docente INT NOT NULL,
        id_ficha INT NOT NULL,
        id_salon INT NOT NULL,
        id_competencia INT NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1,
        
        -- Foreign keys
        FOREIGN KEY (id_docente) REFERENCES docentes(id_docente) ON DELETE CASCADE,
        FOREIGN KEY (id_ficha) REFERENCES fichas(id_ficha) ON DELETE CASCADE,
        FOREIGN KEY (id_salon) REFERENCES salones(id_salon) ON DELETE CASCADE,
        FOREIGN KEY (id_competencia) REFERENCES competencias(id_competencia) ON DELETE CASCADE
    );
END
GO

-- =============================================
-- Índices para mejorar el rendimiento
-- =============================================

-- Índices en horarios (tabla más consultada)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_horarios_dia')
    CREATE INDEX IX_horarios_dia ON horarios(dia);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_horarios_id_docente')
    CREATE INDEX IX_horarios_id_docente ON horarios(id_docente);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_horarios_id_ficha')
    CREATE INDEX IX_horarios_id_ficha ON horarios(id_ficha);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_horarios_id_salon')
    CREATE INDEX IX_horarios_id_salon ON horarios(id_salon);

-- Índices en otras tablas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_docentes_numero_documento')
    CREATE INDEX IX_docentes_numero_documento ON docentes(numero_documento);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_fichas_codigo')
    CREATE INDEX IX_fichas_codigo ON fichas(codigo);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_programas_tipo')
    CREATE INDEX IX_programas_tipo ON programas(tipo);

GO

-- =============================================
-- Función para validar cruces de horarios
-- =============================================
IF EXISTS (SELECT * FROM sysobjects WHERE name = 'fn_validar_cruce_horario' AND xtype = 'FN')
    DROP FUNCTION fn_validar_cruce_horario;
GO

CREATE FUNCTION fn_validar_cruce_horario(
    @id_horario INT,
    @id_docente INT,
    @id_salon INT,
    @id_ficha INT,
    @dia VARCHAR(15),
    @hora_inicio TIME,
    @hora_fin TIME
)
RETURNS BIT
AS
BEGIN
    DECLARE @existe_cruce BIT = 0;
    
    -- Verificar si existe un cruce de horarios
    IF EXISTS (
        SELECT 1 
        FROM horarios 
        WHERE activo = 1
        AND (
            -- Mismo docente en el mismo día y horario
            (id_docente = @id_docente AND dia = @dia AND id_horario != ISNULL(@id_horario, 0)
             AND ((hora_inicio <= @hora_inicio AND hora_fin > @hora_inicio) 
                  OR (hora_inicio < @hora_fin AND hora_fin >= @hora_fin)
                  OR (@hora_inicio <= hora_inicio AND @hora_fin >= hora_fin)))
            -- Mismo salón en el mismo día y horario
            OR (id_salon = @id_salon AND dia = @dia AND id_horario != ISNULL(@id_horario, 0)
                AND ((hora_inicio <= @hora_inicio AND hora_fin > @hora_inicio) 
                     OR (hora_inicio < @hora_fin AND hora_fin >= @hora_fin)
                     OR (@hora_inicio <= hora_inicio AND @hora_fin >= hora_fin)))
            -- Misma ficha en el mismo día y horario
            OR (id_ficha = @id_ficha AND dia = @dia AND id_horario != ISNULL(@id_horario, 0)
                AND ((hora_inicio <= @hora_inicio AND hora_fin > @hora_inicio) 
                     OR (hora_inicio < @hora_fin AND hora_fin >= @hora_fin)
                     OR (@hora_inicio <= hora_inicio AND @hora_fin >= hora_fin)))
        )
    )
    BEGIN
        SET @existe_cruce = 1;
    END
    
    RETURN @existe_cruce;
END
GO

PRINT '✅ Esquema de base de datos creado exitosamente';
