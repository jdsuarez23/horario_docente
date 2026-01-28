# Backend - Sistema de Gestión de Horarios Académicos SENA

## 📋 Descripción

Backend desarrollado con Node.js y Express para el sistema de gestión de horarios académicos del SENA.

## 🏗️ Arquitectura

```
src/
├── config/          # Configuración (database, auth)
├── controllers/     # Controladores de la API
├── services/        # Lógica de negocio
├── models/          # Modelos y queries
├── routes/          # Rutas de la API
├── middleware/      # Middlewares
└── utils/           # Utilidades
```

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con tus configuraciones

4. Iniciar servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `PUT /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/profile` - Perfil del usuario

### Docentes
- `GET /api/docentes` - Listar docentes
- `POST /api/docentes` - Crear docente
- `PUT /api/docentes/:id` - Actualizar docente
- `DELETE /api/docentes/:id` - Eliminar docente

### Competencias
- `GET /api/competencias` - Listar competencias
- `POST /api/competencias` - Crear competencia
- `PUT /api/competencias/:id` - Actualizar competencia
- `DELETE /api/competencias/:id` - Eliminar competencia

### Programas
- `GET /api/programas` - Listar programas
- `POST /api/programas` - Crear programa
- `PUT /api/programas/:id` - Actualizar programa
- `DELETE /api/programas/:id` - Eliminar programa

### Fichas
- `GET /api/fichas` - Listar fichas
- `POST /api/fichas` - Crear ficha
- `PUT /api/fichas/:id` - Actualizar ficha
- `DELETE /api/fichas/:id` - Eliminar ficha

### Salones
- `GET /api/salones` - Listar salones
- `POST /api/salones` - Crear salón
- `PUT /api/salones/:id` - Actualizar salón
- `DELETE /api/salones/:id` - Eliminar salón

### Horarios
- `GET /api/horarios` - Listar horarios
- `POST /api/horarios` - Crear horario
- `PUT /api/horarios/:id` - Actualizar horario
- `DELETE /api/horarios/:id` - Eliminar horario

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas
- `GET /api/dashboard/search` - Búsqueda
- `GET /api/dashboard/horarios` - Horarios con filtros

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación.

### Middlewares

- `authenticateToken` - Verifica token JWT
- `requireAdmin` - Requiere rol de administrador
- `requireCoordinadorOrAdmin` - Requiere rol de coordinador o admin
- `requireDocenteAccess` - Control de acceso para docentes

## 🗄️ Base de Datos

### Conexión

La conexión a SQL Server se configura en `src/config/database.js` usando el paquete `mssql`.

### Pool de Conexiones

- Máximo: 10 conexiones
- Mínimo: 0 conexiones
- Timeout: 30 segundos

## 🔧 Configuración

### Variables de Entorno

```env
PORT=5000
NODE_ENV=development
DB_SERVER=localhost
DB_DATABASE=SENA_Horarios
DB_USER=sa
DB_PASSWORD=tu_contraseña
DB_PORT=1433
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

```bash
npm test
```

## 📝 Notas

- El sistema valida automáticamente los cruces de horarios
- Las contraseñas se hashean con bcrypt
- Los tokens JWT expiran en 7 días por defecto
- Rate limiting está activado (100 requests por 15 minutos)

## 🐛 Errores Comunes

### Error de conexión a SQL Server

Verifica que:
- SQL Server esté ejecutándose
- Las credenciales sean correctas
- El puerto esté correctamente configurado
- El firewall permita conexiones

### Error CORS

Asegúrate de que `FRONTEND_URL` coincida con la URL del frontend.

## 📞 Soporte

Para soporte técnico, revisa:
1. Esta documentación
2. Los logs del servidor
3. La guía de instalación principal