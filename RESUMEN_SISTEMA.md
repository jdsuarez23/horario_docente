# 📊 Resumen del Sistema - SENA Horarios

## 🎯 Objetivo del Sistema

Sistema web completo para la gestión de horarios académicos del SENA, permitiendo administrar docentes, fichas, programas, competencias, rutas formativas, salones y horarios con control de roles.

---

## 🏗️ Arquitectura Completa

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  - React 19 + TypeScript                                   │
│  - Tailwind CSS + shadcn/ui                               │
│  - React Router DOM                                        │
│  - Heroicons                                              │
│  - Context API para estado global                         │
└─────────────────────────────────────────────────────────────┘
                              │
                    REST API (HTTPS)
                              │
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                      │
│  - Express.js 4.18                                        │
│  - SQL Server (mssql)                                     │
│  - JWT Authentication                                     │
│  - bcryptjs (hashing)                                     │
│  - Joi (validación)                                       │
│  - Helmet (seguridad)                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                         SQL Queries
                              │
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (SQL Server)                 │
│  - 9 tablas principales                                   │
│  - Relaciones bien definidas                              │
│  - Índices para optimización                              │
│  - Procedimientos almacenados                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Entregables Completos

### 1. Documentación
- ✅ `README.md` - Arquitectura y guía general
- ✅ `INSTALACION.md` - Guía de instalación paso a paso
- ✅ `RESUMEN_SISTEMA.md` - Este archivo

### 2. Base de Datos
- ✅ `database/scripts/schema.sql` - Estructura de tablas
- ✅ `database/scripts/data.sql` - Datos de prueba
- ✅ `database/scripts/procedures.sql` - Procedimientos almacenados

### 3. Backend (Node.js/Express)
- ✅ `package.json` - Dependencias del proyecto
- ✅ `.env.example` - Variables de entorno de ejemplo
- ✅ `server.js` - Punto de entrada del servidor
- ✅ `src/app.js` - Configuración de Express
- ✅ `src/config/database.js` - Configuración de SQL Server
- ✅ `src/config/auth.js` - Configuración de JWT
- ✅ `src/models/database.js` - Queries y modelos
- ✅ `src/services/` - Servicios de negocio (Auth, Docentes, Competencias, Programas, Fichas, Salones, Horarios, Dashboard)
- ✅ `src/controllers/` - Controladores de la API
- ✅ `src/routes/` - Rutas de la API
- ✅ `src/middleware/` - Middlewares de autenticación y roles

### 4. Frontend (React)
- ✅ `package.json` - Dependencias del proyecto
- ✅ `.env.example` - Variables de entorno de ejemplo
- ✅ `src/App.tsx` - Componente principal con enrutamiento
- ✅ `src/index.css` - Estilos globales con Tailwind CSS
- ✅ `src/styles/sena-theme.css` - Tema personalizado con colores SENA
- ✅ `src/context/AuthContext.jsx` - Contexto de autenticación
- ✅ `src/hooks/useAuth.js` - Hooks de autenticación y API
- ✅ `src/services/api.js` - Servicios de API
- ✅ `src/components/common/` - Layout, Sidebar, Navbar
- ✅ `src/components/auth/` - Login
- ✅ `src/components/dashboard/` - Dashboards por rol
- ✅ `src/pages/` - Páginas principales (CRUDs completos)

---

## 🎨 Diseño Visual (Colores SENA)

### Paleta de Colores Oficial

| Color | Código | Uso |
|-------|--------|-----|
| **Verde Oscuro** | `#005a32` | Navbar, headers, sidebar, botones secundarios |
| **Verde Claro** | `#04b457` | Botones principales, acciones, estados activos |
| **Gris Neutro** | `#c2c2c2` | Bordes, fondos secundarios, tablas |
| **Blanco** | `#ffffff` | Fondos principales, texto sobre colores oscuros |

### Aplicación en Componentes

```css
/* Navbar y Sidebar */
background-color: #005a32;
color: #ffffff;

/* Botones Principales */
background-color: #04b457;
color: #ffffff;

/* Hover de botones */
background-color: #039a4a;

/* Tablas - Header */
background-color: #005a32;
color: #ffffff;

/* Tablas - Filas */
border: 1px solid #c2c2c2;
```

---

## 👥 Roles y Permisos

### Administrador
- ✅ CRUD completo en todas las entidades
- ✅ Acceso a dashboard con todas las estadísticas
- ✅ Gestión de usuarios
- ✅ Acceso a reportes

### Coordinador
- ✅ Ver todas las entidades
- ✅ Editar registros existentes
- ❌ No puede crear ni eliminar
- ✅ Acceso a dashboard con estadísticas limitadas

### Docente
- ✅ Ver su información personal
- ✅ Ver sus fichas asignadas
- ✅ Ver su horario semanal
- ❌ No puede ver información de otros docentes
- ❌ No puede editar información

---

## 🗄️ Base de Datos - Estructura Completa

### Tablas Principales

#### 1. `usuarios`
- id_usuario (PK)
- username
- password_hash
- rol (admin, coordinador, docente)
- id_docente (FK)
- fecha_creacion
- activo

#### 2. `docentes`
- id_docente (PK)
- nombre_apellido
- numero_documento
- celular
- correo
- fecha_registro
- activo

#### 3. `competencias`
- id_competencia (PK)
- nombre
- codigo
- duracion_horas
- fecha_registro
- activo

#### 4. `programas`
- id_programa (PK)
- nombre
- codigo
- tipo (tecnico, tecnologia, asistente)
- duracion_trimestres
- tipo_oferta (abierta, cerrada, encadenamiento)
- fecha_registro
- activo

#### 5. `fichas`
- id_ficha (PK)
- codigo
- id_programa (FK)
- fecha_inicio
- fecha_fin
- fecha_registro
- activo

#### 6. `salones`
- id_salon (PK)
- nombre
- numero
- capacidad
- ubicacion
- fecha_registro
- activo

#### 7. `horarios`
- id_horario (PK)
- dia (lunes, martes, miercoles, jueves, viernes, sabado)
- hora_inicio
- hora_fin
- id_docente (FK)
- id_ficha (FK)
- id_salon (FK)
- id_competencia (FK)
- fecha_registro
- activo

#### 8. `docente_competencia` (Relación N:M)
- id_docente (FK)
- id_competencia (FK)
- fecha_asignacion

#### 9. `ruta_formativa` (Relación N:M)
- id_ruta (PK)
- id_programa (FK)
- id_competencia (FK)
- trimestre

---

## 🚀 Funcionalidades Implementadas

### ✅ Autenticación
- Login con JWT
- Control de roles
- Sesiones persistentes
- Cambio de contraseña

### ✅ Dashboard
- **Admin**: Estadísticas completas, salones más ocupados, docentes con más horarios
- **Coordinador**: Estadísticas limitadas, distribución de horarios
- **Docente**: Mis horarios, mis fichas, salones asignados

### ✅ CRUD Completo

#### Docentes
- Listar, crear, editar, eliminar
- Asignar/remover competencias
- Buscar por nombre, documento o correo
- Ver horarios asignados

#### Competencias
- Listar, crear, editar, eliminar
- Código único
- Duración en horas
- Validación de dependencias

#### Programas
- Listar, crear, editar, eliminar
- Tipos: técnico, tecnología, asistente
- Tipos de oferta: abierta, cerrada, encadenamiento
- Conteo de fichas asociadas

#### Fichas
- Listar, crear, editar, eliminar
- Código único
- Asignación a programas
- Fechas de inicio y fin
- Conteo de horarios

#### Salones
- Listar, crear, editar, eliminar
- Nombre, número, capacidad
- Ubicación
- Conteo de horarios asignados

#### Horarios (Funcionalidad Principal)
- Validación de cruces automática
- Días: lunes a sábado
- Horario: 6:00 AM - 10:00 PM
- Asignación de docente, ficha, salón, competencia
- Verificación de disponibilidad en tiempo real

### ✅ Búsqueda y Filtros
- Buscar docentes por nombre, documento o correo
- Buscar fichas por código
- Filtros por día, docente, ficha, salón

### ✅ Reportes y Visualizaciones
- Horarios por día de la semana
- Salones más ocupados
- Docentes con más horarios
- Estadísticas generales

---

## 📊 Datos de Prueba Incluidos

### Usuarios
- **admin** / admin123 (Administrador)
- **coordinador** / coord123 (Coordinador)
- **carlos.rodriguez** / docente123 (Docente)

### Programas
- Técnico en Sistemas
- Tecnólogo en Análisis y Desarrollo de Software
- Técnico en Electrónica
- Técnico en Mecánica Automotriz
- Asistente en Gestión Administrativa

### Competencias
- Fundamentos de Programación
- Desarrollo Web
- Bases de Datos
- Redes de Computadores
- Electrónica Digital
- Y 10 más...

### Docentes
- 10 docentes de prueba con competencias asignadas

### Fichas
- 8 fichas de prueba con horarios asignados

### Horarios
- 30+ horarios distribuidos en diferentes días y salones

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** 16+ - Entorno de ejecución
- **Express.js** 4.18 - Framework web
- **SQL Server** - Base de datos relacional
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Hashing de contraseñas
- **mssql** - Cliente SQL Server
- **cors** - Control de CORS
- **helmet** - Seguridad
- **joi** - Validación de datos
- **dotenv** - Variables de entorno

### Frontend
- **React** 19 - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Router DOM** - Enrutamiento
- **Heroicons** - Iconos
- **Context API** - Estado global

### Base de Datos
- **SQL Server 2019+** - Motor de base de datos
- **T-SQL** - Lenguaje de consultas
- **Procedimientos almacenados** - Optimización de consultas

---

## 🔐 Seguridad Implementada

### Autenticación
- JWT con expiración configurable
- Almacenamiento seguro en cliente
- Refresh tokens (preparado para implementación)

### Autorización
- Middleware de roles
- Control de permisos por endpoint
- Validación en frontend y backend

### Encriptación
- Contraseñas hasheadas con bcrypt (10 rounds)
- HTTPS recomendado en producción
- Headers de seguridad con Helmet

### Protección Adicional
- Rate limiting (100 requests por 15 minutos)
- Validación de datos con Joi
- CORS configurado por entorno

---

## 📈 Escalabilidad

### Horizontal
- Balanceo de carga con PM2 (preparado)
- Stateless design

### Vertical
- Optimización de consultas SQL
- Índices de base de datos
- Pool de conexiones (max: 10)

### Rendimiento
- Procedimientos almacenados
- Caché de consultas frecuentes
- Lazy loading en frontend

---

## 🎯 Instalación Rápida

### Backend
```bash
cd /mnt/okcomputer/output/backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### Frontend
```bash
cd /mnt/okcomputer/output/app
npm install
cp .env.example .env
# Configurar REACT_APP_API_URL
npm start
```

### Base de Datos
```bash
# Ejecutar en SSMS
database/scripts/schema.sql
database/scripts/procedures.sql
database/scripts/data.sql
```

---

## 🎉 ¡Sistema Listo!

El sistema está completamente desarrollado y listo para usar. Incluye:

✅ Arquitectura limpia y escalable
✅ Autenticación y control de roles
✅ CRUD completo de todas las entidades
✅ Validación de horarios sin cruces
✅ Dashboard con estadísticas
✅ Diseño profesional con colores SENA
✅ Documentación completa
✅ Datos de prueba incluidos
✅ Scripts de base de datos
✅ Guía de instalación detallada

**Accede a:** `http://localhost:3000`

**Credenciales:**
- Admin: admin / admin123
- Coordinador: coordinador / coord123
- Docente: carlos.rodriguez / docente123

---

**Desarrollado con ❤️ para el SENA**