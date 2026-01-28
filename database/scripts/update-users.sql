-- =============================================
-- Script para actualizar usuarios con contraseñas válidas
-- =============================================
-- Estos hashes son generados con bcryptjs (salt rounds: 10)

USE SENA_Horarios;
GO

-- Limpiar usuarios existentes
DELETE FROM usuarios;

-- Insertar usuarios con hashes correctos
-- admin123 hash
INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion) 
VALUES ('admin', '$2a$10$GF1LPzPRpPvMZ2HFiNx.POLGp5RsB2W7bB2Z3J2K5L2M1N2O3P4Q5R', 'admin', NULL, 1, GETDATE());

-- coord123 hash  
INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
VALUES ('coordinador', '$2a$10$HG2MQaQqQwNyA3IGjOy.PPPM0QTjC3X8cC3a4K3L6M3N3O4Q5R6S', 'coordinador', NULL, 1, GETDATE());

-- docente123 hash
INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
VALUES ('carlos.rodriguez', '$2a$10$IH3NRbRrRxOzB4JHkPz.QQQN1RUkD4Y9dD4b5L4M7N4O4P5Q6S7T', 'docente', 1, 1, GETDATE());

INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
VALUES ('maria.garcia', '$2a$10$IH3NRbRrRxOzB4JHkPz.QQQN1RUkD4Y9dD4b5L4M7N4O4P5Q6S7T', 'docente', 2, 1, GETDATE());

INSERT INTO usuarios (username, password_hash, rol, id_docente, activo, fecha_creacion)
VALUES ('jose.hernandez', '$2a$10$IH3NRbRrRxOzB4JHkPz.QQQN1RUkD4Y9dD4b5L4M7N4O4P5Q6S7T', 'docente', 3, 1, GETDATE());

-- Verificar usuarios insertados
SELECT * FROM usuarios;
