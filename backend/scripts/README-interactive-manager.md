# 🎯 Gestor Interactivo de Datos - SENA Horarios

Script interactivo para gestionar usuarios, competencias, programas, fichas y docentes desde la consola.

## 📋 Requisitos

- Node.js instalado
- Acceso a la base de datos SQL Server
- Variables de entorno configuradas en `.env`

## 🚀 Uso

```bash
cd backend
node scripts/interactive-manager.js
```

## 📖 Menú Principal

El script te presenta un menú interactivo con las siguientes opciones:

### 1. 👤 Usuarios
- **Crear usuario**: Nuevo usuario (admin, coordinador, docente)
- **Listar usuarios**: Ver todos los usuarios registrados
- **Actualizar usuario**: Cambiar rol o estado (activo/inactivo)
- **Eliminar usuario**: Desactivar un usuario (soft delete)

### 2. 🎯 Competencias
- **Crear competencia**: Nueva competencia con código y duración
- **Listar competencias**: Ver todas las competencias
- **Actualizar competencia**: Modificar nombre o duración
- **Eliminar competencia**: Desactivar competencia

### 3. 📚 Programas
- **Crear programa**: Nuevo programa con tipo y duración
- **Listar programas**: Ver todos los programas
- **Actualizar programa**: Cambiar nombre o tipo
- **Eliminar programa**: Desactivar programa

### 4. 📋 Fichas
- **Crear ficha**: Nueva ficha vinculada a un programa
- **Listar fichas**: Ver todas las fichas con sus programas
- **Actualizar ficha**: Cambiar fecha de fin
- **Eliminar ficha**: Desactivar ficha

### 5. 👨‍🏫 Docentes
- **Crear docente**: Nuevo docente con datos de contacto
- **Listar docentes**: Ver todos los docentes
- **Actualizar docente**: Cambiar nombre, celular o correo
- **Eliminar docente**: Desactivar docente

## 💡 Ejemplos de Uso

### Crear un Usuario
```
Selecciona una opción: 1 (Usuarios)
Selecciona una opción: 1 (Crear usuario)
Nombre de usuario: nuevo.coordinador
Contraseña: miContraseña123
Rol: coordinador
ID Docente: (dejar en blanco)
✅ Usuario 'nuevo.coordinador' creado exitosamente
```

### Crear una Competencia
```
Selecciona una opción: 2 (Competencias)
Selecciona una opción: 1 (Crear competencia)
Nombre: Desarrollo en Python
Código: PROG_PY002
Duración en horas: 100
✅ Competencia 'Desarrollo en Python' creada exitosamente
```

### Crear un Programa
```
Selecciona una opción: 3 (Programas)
Selecciona una opción: 1 (Crear programa)
Nombre: Técnico en Desarrollo Web
Código: TEC_WEB_02
Tipo: tecnico
Duración en trimestres: 4
Tipo de oferta: abierta
✅ Programa 'Técnico en Desarrollo Web' creado exitosamente
```

### Crear una Ficha
```
Selecciona una opción: 4 (Fichas)
Selecciona una opción: 1 (Crear ficha)
Código de ficha: FIC-2026-NEW003
ID del programa: 1
Fecha de inicio: 2026-02-01
Fecha de fin: 2026-11-30
✅ Ficha 'FIC-2026-NEW003' creada exitosamente
```

### Crear un Docente
```
Selecciona una opción: 5 (Docentes)
Selecciona una opción: 1 (Crear docente)
Nombre y apellido: Pedro Martínez García
Número de documento: 9876543210
Celular: 3105551234
Correo: pedro.martinez@sena.edu.co
✅ Docente 'Pedro Martínez García' creado exitosamente (ID: 11)
```

## 🔐 Seguridad

- Las contraseñas se hashean automáticamente con bcryptjs (10 salt rounds)
- Los datos se almacenan de forma segura en SQL Server
- Las eliminaciones son "soft delete" (se marca como inactivo)

## ⚠️ Notas Importantes

- Los campos con "dejar en blanco" son opcionales
- El script pide confirmación antes de eliminar
- Las fechas deben estar en formato `YYYY-MM-DD`
- Los IDs de programa y docente deben existir en la base de datos

## 🛠️ Solución de Problemas

Si ves errores de conexión:
1. Verifica que SQL Server esté corriendo
2. Verifica las variables en `.env`
3. Asegúrate de tener permisos en la base de datos

Si ves errores de validación:
1. Verifica que los datos ingresados sean válidos
2. Usa las sugerencias del script para corregir
