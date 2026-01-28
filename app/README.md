# Frontend - Sistema de Gestión de Horarios Académicos SENA

## 📋 Descripción

Frontend desarrollado con React y Tailwind CSS para el sistema de gestión de horarios académicos del SENA.

## 🎨 Diseño

### Paleta de Colores (OBLIGATORIA)

```css
:root {
  --sena-primary: #005a32;      /* Verde oscuro - navbar, headers, sidebar */
  --sena-secondary: #04b457;    /* Verde claro - botones, acciones */
  --sena-neutral: #c2c2c2;      /* Gris - bordes, fondos */
  --sena-base: #ffffff;         /* Blanco - fondos principales */
}
```

### Componentes Principales

- **Navbar**: Color #005a32 con texto blanco
- **Sidebar**: Color #005a32 con efectos hover en #04b457
- **Botones Primarios**: Background #04b457
- **Tablas**: Header #005a32 con texto blanco

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con tus configuraciones:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Iniciar aplicación:
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── components/      # Componentes React
│   ├── auth/       # Componentes de autenticación
│   ├── common/     # Componentes comunes (Layout, Sidebar, Navbar)
│   └── dashboard/  # Componentes del dashboard
├── pages/          # Páginas principales
├── hooks/          # Custom hooks
├── services/       # Servicios de API
├── context/        # Contextos de React
├── styles/         # Estilos CSS
└── utils/          # Utilidades
```

## 🔧 Componentes Principales

### Autenticación
- `LoginForm` - Formulario de inicio de sesión
- `AuthContext` - Contexto de autenticación
- `useAuth` - Hook de autenticación

### Layout
- `Layout` - Layout principal con sidebar
- `Sidebar` - Navegación lateral
- `Navbar` - Barra superior

### Dashboard
- `DashboardAdmin` - Dashboard para administradores
- `DashboardCoordinador` - Dashboard para coordinadores
- `DashboardDocente` - Dashboard para docentes

### CRUD Pages
- `Docentes` - Gestión de docentes
- `Competencias` - Gestión de competencias
- `Programas` - Gestión de programas
- `Fichas` - Gestión de fichas
- `Salones` - Gestión de salones
- `Horarios` - Gestión de horarios

## 🔐 Autenticación y Roles

### Roles Disponibles

- **Admin**: Acceso completo a todas las funciones
- **Coordinador**: Puede ver y editar, pero no crear ni eliminar
- **Docente**: Solo puede ver su información y horarios

### Permisos

```javascript
const { canEdit, canDelete, canCreate } = useRole();
```

## 🌐 Servicios de API

### Uso

```javascript
import { docentesService } from '../services/api';

// Listar docentes
const docentes = await docentesService.getAll();

// Crear docente
const nuevoDocente = await docentesService.create(data);

// Actualizar docente
await docentesService.update(id, data);

// Eliminar docente
await docentesService.delete(id);
```

### Servicios Disponibles

- `authService` - Autenticación
- `docentesService` - Gestión de docentes
- `competenciasService` - Gestión de competencias
- `programasService` - Gestión de programas
- `fichasService` - Gestión de fichas
- `salonesService` - Gestión de salones
- `horariosService` - Gestión de horarios
- `dashboardService` - Dashboard y estadísticas

## 🎯 Hooks Personalizados

### useAuth

```javascript
const { user, token, login, logout, isAuthenticated } = useAuth();
```

### useRole

```javascript
const { isAdmin, isCoordinador, isDocente, canEdit, canCreate, canDelete } = useRole();
```

### useApi

```javascript
const { loading, error, get, post, put, del } = useApi();
```

## 🎨 Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con configuración personalizada para los colores del SENA.

### Archivos de Estilo

- `src/index.css` - Estilos globales y configuración de Tailwind
- `src/styles/sena-theme.css` - Variables y estilos del tema SENA

### Clases de Utilidad

```css
/* Colores */
.bg-sena-primary
.bg-sena-secondary
text-sena-primary
text-sena-secondary

/* Componentes */
.sena-card
.sena-table
.sena-form-control
.btn-sena-primary
.btn-sena-secondary
```

## 🧪 Testing

```bash
npm test
```

## 📝 Notas

### Rutas Protegidas

Las rutas están protegidas por el componente `ProtectedRoute` que verifica la autenticación.

### Control de Acceso

El acceso a funciones está controlado por el hook `useRole` que verifica los permisos del usuario.

### Responsive Design

La aplicación es completamente responsive y funciona en dispositivos móviles.

## 🐛 Errores Comunes

### Error de CORS

Asegúrate de que `REACT_APP_API_URL` apunte correctamente al backend.

### Error de autenticación

Verifica que el token JWT sea válido y no haya expirado.

### Error de dependencias

```bash
npm install
```

## 📞 Soporte

Para soporte técnico, revisa:
1. Esta documentación
2. Los logs del navegador
3. La guía de instalación principal