# 📘 Guía de Instalación y Configuración
## Sistema de Gestión de Horarios Académicos - SENA

---

## 🎯 Resumen del Sistema

El **Sistema de Gestión de Horarios Académicos - SENA** es una aplicación web completa diseñada para gestionar de manera eficiente los horarios de formación del Servicio Nacional de Aprendizaje (SENA).

### ✅ Características Principales

- **Backend completo** con Node.js/Express y autenticación JWT
- **Frontend moderno** con React, TypeScript y Tailwind CSS
- **Base de datos robusta** en SQL Server con procedimientos almacenados
- **Control de roles** (Administrador, Coordinador, Docente)
- **Diseño institucional** con paleta de colores oficial del SENA
- **Validación de cruces de horarios** automática
- **Dashboards personalizados** según el rol del usuario
- **Filtros avanzados** por docente, ficha, salón y horario

---

## 🚀 URL del Sistema Desplegado

**Frontend:** https://cewc4cdv3ooko.ok.kimi.link

**Backend:** El backend está configurado para conectarse al frontend desplegado

---

## 👥 Credenciales de Acceso

### Usuario Administrador
- **Username:** `admin`
- **Password:** `admin123`
- **Permisos:** CRUD completo en todas las entidades

### Usuario Coordinador
- **Username:** `coordinador`
- **Password:** `coord123`
- **Permisos:** Ver y editar registros (no crear ni eliminar)

### Usuario Docente
- **Username:** `docente`
- **Password:** `docente123`
- **Permisos:** Ver información personal y horarios asignados

---

## 🛠️ Requisitos Técnicos

### Backend (Node.js)
- **Node.js:** v16.0.0 o superior
- **npm:** v8.0.0 o superior
- **SQL Server:** 2019 o superior

### Frontend (React)
- **Node.js:** v16.0.0 o superior
- **npm:** v8.0.0 o superior

### Base de Datos
- **SQL Server:** 2019 o superior
- **SQL Server Management Studio (SSMS):** Recomendado

---

## 📦 Instalación Local

### 1. Clonar el Proyecto

```bash
git clone https://github.com/tu-usuario/sena-horarios.git
cd sena-horarios
```

### 2. Configuración de Base de Datos

#### Crear Base de Datos

```sql
-- Conéctate a SQL Server y ejecuta:
CREATE DATABASE SENA_Horarios;
GO

USE SENA_Horarios;
GO
```

#### Ejecutar Scripts SQL

1. Abre **SQL Server Management Studio**
2. Conéctate a tu servidor
3. Abre el archivo `database/scripts/schema.sql`
4. Ejecuta todo el script para crear las tablas
5. Abre el archivo `database/scripts/data.sql`
6. Ejecuta el script para insertar datos iniciales
7. Abre el archivo `database/scripts/procedures.sql`
8. Ejecuta el script para crear procedimientos almacenados

### 3. Configuración del Backend

#### Instalar Dependencias

```bash
cd backend
npm install
```

#### Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Puerto del servidor
PORT=5000
NODE_ENV=development

# Base de datos
DB_SERVER=localhost
DB_DATABASE=SENA_Horarios
DB_USER=sa
DB_PASSWORD=tu_contraseña_aquí
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_y_largo
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PROD=https://tu-dominio.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

### 4. Configuración del Frontend

#### Instalar Dependencias

```bash
cd ../frontend
npm install
```

#### Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Iniciar la Aplicación

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 🎨 Paleta de Colores Institucional

El sistema utiliza estrictamente los colores institucionales del SENA:

| Color | Código Hex | Uso Principal |
|-------|------------|---------------|
| **Verde Oscuro** | `#005a32` | Navbar, headers, sidebar |
| **Verde Claro** | `#04b457` | Botones, acciones, estados activos |
| **Gris** | `#c2c2c2` | Bordes, fondos secundarios, tablas |
| **Blanco** | `#ffffff` | Fondos principales |

---

## 📊 Estructura de Base de Datos

### Tablas Principales

1. **usuarios** - Gestión de usuarios del sistema
2. **docentes** - Información de instructores
3. **competencias** - Competencias formativas
4. **programas** - Programas de formación
5. **fichas** - Grupos de aprendices
6. **salones** - Espacios físicos de formación
7. **horarios** - Horarios asignados
8. **ruta_formativa** - Rutas de aprendizaje
9. **docente_competencia** - Relación docente-competencia

### Relaciones

- Un **docente** puede tener múltiples **competencias**
- Un **programa** tiene múltiples **competencias** (ruta formativa)
- Una **ficha** pertenece a un **programa**
- Un **horario** relaciona: docente, ficha, salón y competencia

---

## 🔐 Control de Roles y Permisos

### Administrador
- ✅ CRUD completo en todas las entidades
- ✅ Gestión de usuarios
- ✅ Acceso a dashboard con todas las estadísticas
- ✅ Configuración del sistema

### Coordinador
- ✅ Ver todas las entidades
- ✅ Editar registros existentes
- ❌ No puede crear nuevos registros
- ❌ No puede eliminar registros
- ✅ Acceso a dashboard con filtros limitados

### Docente
- ✅ Ver su información personal
- ✅ Ver fichas asociadas
- ✅ Ver su horario asignado
- ❌ No puede ver información de otros docentes
- ❌ No puede editar información

---

## 📋 Funcionalidades del Sistema

### 1. Autenticación
- Login con username y contraseña
- JWT con expiración configurable
- Control de sesiones
- Cambio de contraseña

### 2. Gestión de Docentes
- CRUD completo de instructores
- Asignación de competencias
- Consulta de horarios por docente
- Búsqueda por nombre o documento

### 3. Gestión de Fichas
- CRUD de grupos de aprendices
- Asignación a programas
- Consulta de horarios por ficha
- Búsqueda por código

### 4. Gestión de Programas
- CRUD de programas de formación
- Tipos: técnico, tecnología, asistente
- Configuración de duración
- Gestión de rutas formativas

### 5. Gestión de Competencias
- CRUD de competencias
- Asignación a docentes
- Duración en horas
- Integración con rutas formativas

### 6. Gestión de Salones
- CRUD de espacios físicos
- Capacidad y ubicación
- Consulta de horarios por salón
- Disponibilidad de espacios

### 7. Gestión de Horarios
- CRUD completo de horarios
- Validación automática de cruces
- Filtros por: docente, ficha, salón, día
- Horarios en formato 24 horas
- Días: lunes a sábado

### 8. Dashboard
- Estadísticas generales
- Horarios por día
- Salones más ocupados
- Docentes con más horarios
- Filtros interactivos

---

## 🔍 Filtros Disponibles

### Por Docente
- Busca por nombre o número de documento
- Ver horario semanal del instructor
- Ver competencias que imparte
- Ver salones donde dicta clases

### Por Ficha
- Busca por código de ficha
- Ver horario completo del grupo
- Ver docente de cada competencia
- Ver salón asignado

### Por Salón
- Busca por nombre o número
- Ver horario completo del espacio
- Ver docente asignado en cada horario
- Ver fichas programadas

### Por Horario
- Filtra por día de la semana
- Filtra por rango de horas
- Ver disponibilidad de espacios
- Ver docentes disponibles

---

## 🛡️ Seguridad

### Autenticación
- JWT con expiración configurable
- Tokens seguros almacenados en cliente
- Refresh tokens (preparado para implementación)

### Autorización
- Middleware de roles en backend
- Control de permisos por endpoint
- Validación en frontend y backend
- Protección de rutas en React

### Encriptación
- Contraseñas hasheadas con bcrypt
- HTTPS en producción (recomendado)
- Headers de seguridad con Helmet
- Rate limiting para prevenir ataques

---

## 📁 Estructura del Proyecto

```
sena-horarios/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── auth.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── docentesController.js
│   │   │   ├── competenciasController.js
│   │   │   ├── programasController.js
│   │   │   ├── fichasController.js
│   │   │   ├── salonesController.js
│   │   │   ├── horariosController.js
│   │   │   └── dashboardController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── docentesService.js
│   │   │   ├── competenciasService.js
│   │   │   ├── programasService.js
│   │   │   ├── fichasService.js
│   │   │   ├── salonesService.js
│   │   │   ├── horariosService.js
│   │   │   └── dashboardService.js
│   │   ├── models/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── docentes.js
│   │   │   ├── competencias.js
│   │   │   ├── programas.js
│   │   │   ├── fichas.js
│   │   │   ├── salones.js
│   │   │   ├── horarios.js
│   │   │   └── dashboard.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardAdmin.jsx
│   │   │   │   ├── DashboardCoordinador.jsx
│   │   │   │   └── DashboardDocente.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Table.jsx
│   │   │       └── Modal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Docentes.jsx
│   │   │   ├── Fichas.jsx
│   │   │   ├── Programas.jsx
│   │   │   ├── Competencias.jsx
│   │   │   ├── Salones.jsx
│   │   │   └── Horarios.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   └── sena-theme.css
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── scripts/
│       ├── schema.sql
│       ├── data.sql
│       └── procedures.sql
│
└── README.md
```

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to SQL Server"

**Solución:**
```bash
# Verificar que SQL Server esté corriendo
netstat -an | findstr 1433

# Verificar credenciales en .env
# Asegurarse de que el usuario tenga permisos
```

### Error: "Token inválido o expirado"

**Solución:**
- Limpiar localStorage del navegador
- Volver a iniciar sesión
- Verificar JWT_SECRET en backend

### Error: "Cruce de horarios detectado"

**Solución:**
- El sistema valida automáticamente que no haya cruces
- Verificar disponibilidad antes de crear horario
- Usar el botón "Verificar Disponibilidad"

---

## 📞 Soporte Técnico

Para soporte técnico o reporte de bugs:

1. Verificar los logs del servidor
2. Revisar la consola del navegador
3. Verificar la conexión a base de datos
4. Contactar al equipo de desarrollo

---

## 📝 Notas Importantes

1. **Horarios:** El sistema maneja horario colombiano (UTC-5)
2. **Soft Delete:** Todos los registros tienen campo `activo` para eliminación lógica
3. **Contraseñas:** Mínimo 6 caracteres, se recomienda uso de mayúsculas, minúsculas y números
4. **Horarios:** Formato 24 horas (HH:MM:SS)
5. **Validación:** El sistema valida automáticamente cruces de horarios

---

## 🔄 Actualizaciones

Para actualizar el sistema:

1. Hacer backup de la base de datos
2. Actualizar código del repositorio
3. Ejecutar migraciones si las hay
4. Reiniciar servicios
5. Verificar funcionamiento

---

## 📄 Licencia

Este sistema fue desarrollado para uso educativo del SENA.

---

## ✨ Agradecimientos

Desarrollado con ❤️ para el Servicio Nacional de Aprendizaje - SENA

---

**Última actualización:** 27 de enero de 2026