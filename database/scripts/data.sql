-- =============================================
-- Sistema de Gestión de Horarios Académicos - SENA
-- Script de datos iniciales y usuarios de prueba
-- =============================================

USE SENA_Horarios;
GO

-- =============================================
-- LIMPIAR DATOS PREVIOS (OPCIONAL)
-- =============================================
-- Descomenta esto si quieres limpiar los datos antes de ejecutar
/*
DELETE FROM horarios;
DELETE FROM docente_competencia;
DELETE FROM ruta_formativa;
DELETE FROM fichas;
DELETE FROM docentes;
DELETE FROM competencias;
DELETE FROM programas;
DELETE FROM salones;
DELETE FROM usuarios;
*/

-- =============================================
-- Insertar salones
-- =============================================
PRINT 'Insertando salones...';

INSERT INTO salones (nombre, numero, capacidad, ubicacion) VALUES
('Aula de Sistemas 1', '101', 30, 'Bloque A - Primer piso'),
('Aula de Sistemas 2', '102', 30, 'Bloque A - Primer piso'),
('Aula de Electrónica', '201', 25, 'Bloque B - Segundo piso'),
('Taller Mecánico', 'T1', 20, 'Bloque Talleres'),
('Laboratorio Redes', 'LAB1', 15, 'Bloque C - Primer piso'),
('Aula Multimedios', '301', 35, 'Bloque C - Tercer piso'),
('Laboratorio de Software', 'LAB2', 25, 'Bloque A - Segundo piso'),
('Aula de Matemáticas', '202', 30, 'Bloque B - Segundo piso');


-- =============================================
-- Insertar programas
-- =============================================
PRINT 'Insertando programas...';

INSERT INTO programas (nombre, codigo, tipo, duracion_trimestres, tipo_oferta) VALUES
('Técnico en Sistemas', 'TSI', 'tecnico', 4, 'abierta'),
('Tecnólogo en Análisis y Desarrollo de Software', 'ADSO', 'tecnologia', 6, 'abierta'),
('Técnico en Electrónica', 'TEL', 'tecnico', 4, 'cerrada'),
('Técnico en Mecánica Automotriz', 'TMA', 'tecnico', 4, 'encadenamiento'),
('Asistente en Gestión Administrativa', 'AGA', 'asistente', 2, 'abierta'),
('Técnico en Redes de Datos', 'TRD', 'tecnico', 4, 'abierta'),
('Tecnólogo en Electrónica y Telecomunicaciones', 'TET', 'tecnologia', 6, 'cerrada');

-- =============================================
-- Insertar competencias
-- =============================================
PRINT 'Insertando competencias...';

INSERT INTO competencias (nombre, codigo, duracion_horas) VALUES
('Fundamentos de Programación', 'COMP001', 80),
('Desarrollo Web', 'COMP002', 120),
('Bases de Datos', 'COMP003', 100),
('Redes de Computadores', 'COMP004', 90),
('Electrónica Digital', 'COMP005', 100),
('Sistemas Embebidos', 'COMP006', 110),
('Mecánica Básica', 'COMP007', 80),
('Diagnóstico Automotriz', 'COMP008', 120),
('Gestión Documental', 'COMP009', 60),
('Comunicación Organizacional', 'COMP010', 50),
('Matemáticas Aplicadas', 'COMP011', 80),
('Estadística', 'COMP012', 70),
('Seguridad en Redes', 'COMP013', 90),
('Desarrollo Móvil', 'COMP014', 100),
('Inteligencia Artificial', 'COMP015', 120);

-- =============================================
-- Insertar rutas formativas
-- =============================================
PRINT 'Insertando rutas formativas...';

-- Ruta Técnico en Sistemas
INSERT INTO ruta_formativa (id_programa, id_competencia, trimestre) 
SELECT 1, COMP.id_competencia, CASE COMP.codigo 
    WHEN 'COMP001' THEN 1 
    WHEN 'COMP002' THEN 2 
    WHEN 'COMP003' THEN 2 
    WHEN 'COMP011' THEN 1 
    ELSE 3 
END
FROM competencias COMP 
WHERE COMP.codigo IN ('COMP001', 'COMP002', 'COMP003', 'COMP011', 'COMP013', 'COMP014');

-- Ruta Tecnología ADSO
INSERT INTO ruta_formativa (id_programa, id_competencia, trimestre) 
SELECT 2, COMP.id_competencia, CASE COMP.codigo 
    WHEN 'COMP001' THEN 1 
    WHEN 'COMP002' THEN 2 
    WHEN 'COMP003' THEN 2 
    WHEN 'COMP004' THEN 3 
    WHEN 'COMP013' THEN 4 
    WHEN 'COMP014' THEN 5 
    WHEN 'COMP015' THEN 6 
    ELSE 1 
END
FROM competencias COMP 
WHERE COMP.codigo IN ('COMP001', 'COMP002', 'COMP003', 'COMP004', 'COMP013', 'COMP014', 'COMP015', 'COMP011', 'COMP012');

-- Ruta Electrónica
INSERT INTO ruta_formativa (id_programa, id_competencia, trimestre) 
SELECT 3, COMP.id_competencia, CASE COMP.codigo 
    WHEN 'COMP005' THEN 2 
    WHEN 'COMP006' THEN 3 
    WHEN 'COMP004' THEN 4 
    ELSE 1 
END
FROM competencias COMP 
WHERE COMP.codigo IN ('COMP005', 'COMP006', 'COMP004', 'COMP011');

-- =============================================
-- Insertar docentes
-- =============================================
PRINT 'Insertando docentes...';

INSERT INTO docentes (nombre_apellido, numero_documento, celular, correo) VALUES
('Carlos Andrés Rodríguez Pérez', '1234567890', '3001234567', 'carlos.rodriguez@sena.edu.co'),
('María Elena García Martínez', '0987654321', '3002345678', 'maria.garcia@sena.edu.co'),
('José Luis Hernández Sánchez', '1122334455', '3003456789', 'jose.hernandez@sena.edu.co'),
('Ana Patricia López Díaz', '5544332211', '3004567890', 'ana.lopez@sena.edu.co'),
('Pedro Manuel González Ramírez', '6677889900', '3005678901', 'pedro.gonzalez@sena.edu.co'),
('Laura Cristina Martínez Torres', '0099887766', '3006789012', 'laura.martinez@sena.edu.co'),
('Diego Fernando Sánchez Castro', '4433221100', '3007890123', 'diego.sanchez@sena.edu.co'),
('Sofía Alejandra Ramírez Jiménez', '5566778899', '3008901234', 'sofia.ramirez@sena.edu.co'),
('Miguel Ángel Torres Vargas', '7788990011', '3009012345', 'miguel.torres@sena.edu.co'),
('Valentina Herrera Morales', '2233445566', '3000123456', 'valentina.herrera@sena.edu.co');

-- =============================================
-- Asignar competencias a docentes
-- =============================================
PRINT 'Asignando competencias a docentes...';

-- Carlos Andrés (Programación y Desarrollo Web)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 1, id_competencia FROM competencias WHERE codigo IN ('COMP001', 'COMP002', 'COMP014');

-- María Elena (Bases de Datos)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 2, id_competencia FROM competencias WHERE codigo IN ('COMP003', 'COMP012');

-- José Luis (Redes y Seguridad)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 3, id_competencia FROM competencias WHERE codigo IN ('COMP004', 'COMP013');

-- Ana Patricia (Electrónica)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 4, id_competencia FROM competencias WHERE codigo IN ('COMP005', 'COMP006');

-- Pedro Manuel (Mecánica)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 5, id_competencia FROM competencias WHERE codigo IN ('COMP007', 'COMP008');

-- Laura Cristina (Gestión Administrativa)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 6, id_competencia FROM competencias WHERE codigo IN ('COMP009', 'COMP010');

-- Diego Fernando (Matemáticas y Estadística)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 7, id_competencia FROM competencias WHERE codigo IN ('COMP011', 'COMP012');

-- Sofía Alejandra (Desarrollo Web y Móvil)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 8, id_competencia FROM competencias WHERE codigo IN ('COMP002', 'COMP014');

-- Miguel Ángel (IA y Desarrollo)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 9, id_competencia FROM competencias WHERE codigo IN ('COMP015', 'COMP001');

-- Valentina Herrera (Redes y Telecomunicaciones)
INSERT INTO docente_competencia (id_docente, id_competencia) 
SELECT 10, id_competencia FROM competencias WHERE codigo IN ('COMP004', 'COMP013');

-- =============================================
-- Insertar fichas
-- =============================================
PRINT 'Insertando fichas...';

INSERT INTO fichas (codigo, id_programa, fecha_inicio, fecha_fin) VALUES
('FIC-2024-001', 1, '2024-02-01', '2024-11-30'),
('FIC-2024-002', 1, '2024-02-01', '2024-11-30'),
('FIC-2024-003', 2, '2024-02-01', '2025-01-31'),
('FIC-2024-004', 3, '2024-03-01', '2024-12-31'),
('FIC-2024-005', 4, '2024-02-15', '2024-11-15'),
('FIC-2024-006', 5, '2024-03-15', '2024-08-15'),
('FIC-2024-007', 6, '2024-02-01', '2024-11-30'),
('FIC-2024-008', 2, '2024-08-01', '2025-02-28');

-- =============================================
-- Insertar horarios
-- =============================================
PRINT 'Insertando horarios...';

-- Horarios para FIC-2024-001 (Técnico en Sistemas)
INSERT INTO horarios (dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia) VALUES
('lunes', '08:00:00', '10:00:00', 1, 1, 1, 1),    -- Carlos - Fundamentos Programación
('lunes', '10:00:00', '12:00:00', 7, 1, 1, 11),   -- Diego - Matemáticas
('martes', '08:00:00', '10:00:00', 1, 1, 2, 2),   -- Carlos - Desarrollo Web
('martes', '10:00:00', '12:00:00', 2, 1, 2, 3),   -- María Elena - Bases de Datos
('miercoles', '08:00:00', '10:00:00', 1, 1, 1, 1), -- Carlos - Fundamentos Programación
('miercoles', '10:00:00', '12:00:00', 7, 1, 1, 11), -- Diego - Matemáticas
('jueves', '08:00:00', '10:00:00', 1, 1, 2, 2),   -- Carlos - Desarrollo Web
('jueves', '10:00:00', '12:00:00', 2, 1, 2, 3),   -- María Elena - Bases de Datos
('viernes', '08:00:00', '10:00:00', 8, 1, 7, 14), -- Sofía - Desarrollo Móvil
('viernes', '10:00:00', '12:00:00', 7, 1, 1, 12); -- Diego - Estadística

-- Horarios para FIC-2024-003 (Tecnología ADSO)
INSERT INTO horarios (dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia) VALUES
('lunes', '14:00:00', '16:00:00', 9, 3, 6, 15),   -- Miguel - IA
('lunes', '16:00:00', '18:00:00', 2, 3, 6, 3),    -- María Elena - Bases de Datos
('martes', '14:00:00', '16:00:00', 8, 3, 6, 14),  -- Sofía - Desarrollo Móvil
('martes', '16:00:00', '18:00:00', 3, 3, 5, 4),   -- José Luis - Redes
('miercoles', '14:00:00', '16:00:00', 9, 3, 6, 15), -- Miguel - IA
('miercoles', '16:00:00', '18:00:00', 2, 3, 6, 3), -- María Elena - Bases de Datos
('jueves', '14:00:00', '16:00:00', 8, 3, 6, 14),  -- Sofía - Desarrollo Móvil
('jueves', '16:00:00', '18:00:00', 3, 3, 5, 13),  -- José Luis - Seguridad en Redes
('viernes', '14:00:00', '16:00:00', 9, 3, 6, 1),  -- Miguel - Fundamentos
('viernes', '16:00:00', '18:00:00', 7, 3, 6, 11); -- Diego - Matemáticas

-- Horarios para FIC-2024-004 (Electrónica)
INSERT INTO horarios (dia, hora_inicio, hora_fin, id_docente, id_ficha, id_salon, id_competencia) VALUES
('lunes', '06:00:00', '08:00:00', 4, 4, 3, 5),    -- Ana Patricia - Electrónica Digital
('martes', '06:00:00', '08:00:00', 4, 4, 3, 6),    -- Ana Patricia - Sistemas Embebidos
('miercoles', '06:00:00', '08:00:00', 4, 4, 3, 5),  -- Ana Patricia - Electrónica Digital
('jueves', '06:00:00', '08:00:00', 4, 4, 3, 6),    -- Ana Patricia - Sistemas Embebidos
('viernes', '06:00:00', '08:00:00', 3, 4, 3, 4),    -- José Luis - Redes
('sabado', '08:00:00', '12:00:00', 4, 4, 3, 5);    -- Ana Patricia - Electrónica Digital

-- =============================================
-- Insertar usuarios
-- =============================================
PRINT 'Insertando usuarios...';

-- NOTA: Las contraseñas se hashean con bcryptjs (salt rounds: 10)
-- admin123 -> $2a$10$gSvqqUPz639PKsFJVeuU.eewhjLQjuTWw2oM7TKh4yf6pVqJfLIlW
-- coord123 -> $2a$10$bNFXA7V4MZy9M.o4xBpNOOAjv9s9fJ3VqKqTvU2NJpZ5dJmZ3KBrK
-- docente123 -> $2a$10$2pFznNQNb3VhkLqYJqLpNuWRQfqEfN1yKV2M7hJ8cZ1bLpU9M7eFq

-- Administrador
INSERT INTO usuarios (username, password_hash, rol, id_docente) VALUES
('admin', '$2a$10$gSvqqUPz639PKsFJVeuU.eewhjLQjuTWw2oM7TKh4yf6pVqJfLIlW', 'admin', NULL);

-- Coordinador
INSERT INTO usuarios (username, password_hash, rol, id_docente) VALUES
('coordinador', '$2a$10$bNFXA7V4MZy9M.o4xBpNOOAjv9s9fJ3VqKqTvU2NJpZ5dJmZ3KBrK', 'coordinador', NULL);

-- Docentes (relacionados con docentes 1, 2 y 3)
INSERT INTO usuarios (username, password_hash, rol, id_docente) VALUES
('carlos.rodriguez', '$2a$10$2pFznNQNb3VhkLqYJqLpNuWRQfqEfN1yKV2M7hJ8cZ1bLpU9M7eFq', 'docente', 1),
('maria.garcia', '$2a$10$2pFznNQNb3VhkLqYJqLpNuWRQfqEfN1yKV2M7hJ8cZ1bLpU9M7eFq', 'docente', 2),
('jose.hernandez', '$2a$10$2pFznNQNb3VhkLqYJqLpNuWRQfqEfN1yKV2M7hJ8cZ1bLpU9M7eFq', 'docente', 3);

-- =============================================
-- Verificación de datos insertados
-- =============================================
PRINT '=============================================';
PRINT 'RESUMEN DE DATOS INSERTADOS';
PRINT '=============================================';
PRINT 'Salones: ' + CAST(@@ROWCOUNT AS VARCHAR(10));

SELECT 
    'Salones' AS tabla, COUNT(*) AS registros FROM salones WHERE activo = 1
UNION ALL
SELECT 
    'Programas', COUNT(*) FROM programas WHERE activo = 1
UNION ALL
SELECT 
    'Competencias', COUNT(*) FROM competencias WHERE activo = 1
UNION ALL
SELECT 
    'Docentes', COUNT(*) FROM docentes WHERE activo = 1
UNION ALL
SELECT 
    'Fichas', COUNT(*) FROM fichas WHERE activo = 1
UNION ALL
SELECT 
    'Horarios', COUNT(*) FROM horarios WHERE activo = 1
UNION ALL
SELECT 
    'Usuarios', COUNT(*) FROM usuarios WHERE activo = 1;

PRINT '✅ Datos iniciales insertados exitosamente';
PRINT 'Contraseñas de prueba: admin123, coord123, docente123';
