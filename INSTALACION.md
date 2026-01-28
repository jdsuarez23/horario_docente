# 📦 Guía de Instalación - Sistema de Gestión de Horarios Académicos SENA

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de Base de Datos](#instalación-de-base-de-datos)
3. [Instalación del Backend](#instalación-del-backend)
4. [Instalación del Frontend](#instalación-del-frontend)
5. [Configuración de SQL Server](#configuración-de-sql-server)
6. [Puesta en Marcha](#puesta-en-marcha)
7. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

### Software Necesario

- **Node.js** (v16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene con Node.js) o **yarn**
- **SQL Server 2019 o superior** - [Descargar aquí](https://www.microsoft.com/sql-server/sql-server-downloads)
- **SQL Server Management Studio (SSMS)** - [Descargar aquí](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)
- **Git** (opcional) - [Descargar aquí](https://git-scm.com/)
- **Visual Studio Code** (recomendado) - [Descargar aquí](https://code.visualstudio.com/)

### Conocimientos Recomendados

- JavaScript/Node.js
- React
- SQL Server
- Git

---

## 🗄️ Instalación de Base de Datos

### Paso 1: Crear Base de Datos

1. Abre **SQL Server Management Studio (SSMS)**
2. Conéctate a tu servidor SQL Server
3. Abre un nueva query y ejecuta:

```sql
CREATE DATABASE SENA_Horarios;
GO

USE SENA_Horarios;
GO
```

### Paso 2: Ejecutar Scripts

1. En SSMS, abre el archivo `database/scripts/schema.sql`
2. Ejecuta todo el script para crear las tablas
3. Abre el archivo `database/scripts/procedures.sql`
4. Ejecuta el script para crear los procedimientos almacenados
5. Abre el archivo `database/scripts/data.sql`
6. Ejecuta el script para insertar datos de prueba

### Paso 3: Verificar Instalación

```sql
-- Verificar tablas creadas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Verificar datos de prueba
SELECT * FROM usuarios;
SELECT * FROM docentes;
SELECT * FROM programas;
```

---

## ⚙️ Configuración de SQL Server

### Habilitar Autenticación Mixta

1. Abre **SQL Server Management Studio**
2. Click derecho en el servidor → **Properties**
3. Ve a la pestaña **Security**
4. Selecciona **SQL Server and Windows Authentication mode**
5. Reinicia el servicio SQL Server

### Crear Usuario para la Aplicación

```sql
-- Crear login
CREATE LOGIN sena_app WITH PASSWORD = 'TuContraseñaSegura123!';
GO

-- Crear usuario en la base de datos
USE SENA_Horarios;
GO
CREATE USER sena_app FOR LOGIN sena_app;
GO

-- Asignar permisos
ALTER ROLE db_owner ADD MEMBER sena_app;
GO
```

### Configurar Puerto (Opcional)

Si SQL Server no usa el puerto por defecto (1433):

1. Abre **SQL Server Configuration Manager**
2. Ve a **SQL Server Network Configuration** → **Protocols for MSSQLSERVER**
3. Habilita **TCP/IP**
4. En **IP Addresses**, configura el puerto en **TCP Port**
5. Reinicia el servicio SQL Server

---

## 🚀 Instalación del Backend

### Paso 1: Navegar al Directorio

```bash
cd /mnt/okcomputer/output/backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

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
DB_USER=sena_app
DB_PASSWORD=TuContraseñaSegura123!
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_con_al_menos_32_caracteres
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PROD=https://tu-dominio.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Paso 4: Iniciar el Servidor

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

---

## 🎨 Instalación del Frontend

### Paso 1: Navegar al Directorio

```bash
cd /mnt/okcomputer/output/app
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_APP_NAME=SENA Horarios
REACT_APP_VERSION=1.0.0

# Environment
REACT_APP_ENVIRONMENT=development
```

### Paso 4: Iniciar la Aplicación

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 🔄 Puesta en Marcha

### Secuencia de Inicio

1. **Iniciar SQL Server**
   ```bash
   # Windows
   net start MSSQLSERVER
   
   # Linux (Docker)
   docker start sqlserver
   ```

2. **Iniciar Backend**
   ```bash
   cd /mnt/okcomputer/output/backend
   npm run dev
   ```

3. **Iniciar Frontend**
   ```bash
   cd /mnt/okcomputer/output/app
   npm start
   ```

### Verificar Funcionamiento

1. Abre el navegador en `http://localhost:3000`
2. Inicia sesión con:
   - **Admin:** username: `admin`, password: `admin123`
   - **Coordinador:** username: `coordinador`, password: `coord123`
   - **Docente:** username: `carlos.rodriguez`, password: `docente123`

---

## 🐛 Solución de Problemas

### Error: No se puede conectar a SQL Server

**Solución:**
1. Verifica que SQL Server esté ejecutándose
2. Verifica el puerto en SQL Server Configuration Manager
3. Verifica las credenciales en el archivo `.env`
4. Asegúrate de que el firewall permita conexiones al puerto 1433

### Error: CORS en el frontend

**Solución:**
1. Verifica que `FRONTEND_URL` en backend `.env` coincida con la URL del frontend
2. Reinicia el servidor backend después de cambiar la configuración

### Error: Token expirado

**Solución:**
1. Cierra sesión y vuelve a iniciar
2. Verifica que `JWT_SECRET` tenga al menos 32 caracteres

### Error: Dependencias faltantes

**Solución:**
```bash
# Backend
npm install

# Frontend
cd app
npm install
```

### Error: Puerto ya en uso

**Solución:**
```bash
# Cambiar puerto del backend (editar .env)
PORT=5001

# Cambiar puerto del frontend
REACT_APP_API_URL=http://localhost:5001/api
PORT=3001
```

---

## 📝 Notas Importantes

### Seguridad

1. **Cambia las contraseñas por defecto** antes de poner en producción
2. **Usa HTTPS** en producción
3. **Configura CORS** correctamente para producción
4. **Usa variables de entorno** para credenciales sensibles

### Rendimiento

1. **Índices de base de datos** ya están configurados en los scripts SQL
2. **Pool de conexiones** está configurado para 10 conexiones máximas
3. **Rate limiting** está activado por defecto (100 requests por 15 minutos)

### Mantenimiento

1. **Backups regulares** de la base de datos
2. **Monitoreo de logs** del servidor
3. **Actualizaciones de seguridad** de dependencias

---

## 📞 Soporte

Para soporte técnico:

1. Revisa esta guía de instalación
2. Consulta la documentación en `/docs`
3. Revisa los logs del servidor
4. Contacta al equipo de desarrollo

---

## 🎉 ¡Listo!

El sistema está instalado y listo para usar. Accede a `http://localhost:3000` para comenzar.

**Credenciales de prueba:**
- Admin: admin / admin123
- Coordinador: coordinador / coord123
- Docente: carlos.rodriguez / docente123

---

**Desarrollado con ❤️ para el SENA**