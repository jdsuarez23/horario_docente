-- Migración: Agregar columna trimestre a fichas
-- Descripción: Añade el campo trimestre a la tabla fichas para soportar trimestres de 1-6

-- Verificar si la columna existe y agregarla
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'fichas' AND COLUMN_NAME = 'trimestre'
)
BEGIN
    ALTER TABLE fichas
    ADD trimestre INT NULL;
END
