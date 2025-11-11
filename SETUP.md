# 🔧 Guía de Instalación - Calculador de Costos

## 📋 Requisitos Previos

- **Node.js** v16+ (descargable de https://nodejs.org)
- **MySQL** v5.7+ (XAMPP, WAMP, o instalación manual)

---

## 🚀 Paso 1: Instalación

### 1.1 Instalar dependencias

```bash
npm install
```

### 1.2 Instalar dependencias del cliente

```bash
cd client
npm install
cd ..
```

---

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Crear la BD y tablas

1. **Abre phpMyAdmin** (http://localhost/phpmyadmin)
2. **Click en "Importar"**
3. **Selecciona el archivo**: `server/database.sql`
4. **Click en "Abrir"**

O si prefieres usar terminal MySQL:

```bash
mysql -u root -p < server/database.sql
```

### 2.2 Generar contraseña para el admin

Ejecuta el script para generar una contraseña hasheada:

```bash
npm run hash-password admin123
```

> **Esto mostrará un hash como**: `$2a$10$...`

### 2.3 Actualizar la contraseña en la BD

1. **En phpMyAdmin**, abre la tabla `admin`
2. **Click en el ícono de lápiz** para la fila del admin
3. **Reemplaza el valor de `password`** con el hash generado
4. **Click en "Actualizar"**

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo `.env` en la raíz

Copia el contenido de `.env.example`:

```bash
cp .env.example .env
```

### 3.2 Editar `.env` con tus credenciales

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=     (tu contraseña de MySQL, si la tiene)
DB_NAME=calculador_costos
DB_PORT=3306

SERVER_PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-this-in-production

VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Paso 4: Ejecutar en Desarrollo

### Opción A: Ejecutar todo junto (recomendado)

```bash
npm run dev
```

Esto abrirá:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Opción B: Ejecutar por separado

**Terminal 1 - Servidor:**
```bash
npm run server:dev
```

**Terminal 2 - Cliente:**
```bash
npm run client:dev
```

---

## 🔐 Acceder a la Aplicación

### Página Pública (Calculador)

```
http://localhost:5173
```

- Selecciona items
- Ve el cálculo automático
- **Link a admin**: Abajo a la derecha

### Panel de Administración (Protegido)

```
http://localhost:5173/admin/login
```

**Credenciales por defecto:**
- **Usuario**: `admin`
- **Contraseña**: `admin123` (la que configuraste)

---

## 📝 Operaciones Disponibles

### En el Calculador Público

✅ Ver items disponibles
✅ Seleccionar/deseleccionar items
✅ Ver cálculo automático con impuesto
✅ Acceso al login de admin

### En el Panel de Admin

✅ Ver todos los items existentes
✅ Agregar nuevos items
✅ Editar nombre, precio, descripción
✅ Eliminar items
✅ Cerrar sesión

---

## 🐛 Solucionar Problemas

### Error: "Cannot find module 'mysql2'"

```bash
npm install
cd client
npm install
cd ..
```

### Error: "ECONNREFUSED" - No conecta a MySQL

- Verifica que MySQL esté corriendo
- En XAMPP: abre el panel y da click en "Start" en MySQL
- Verifica el host, usuario y contraseña en `.env`

### Error: "Credenciales inválidas" en login

- Asegúrate de haber actualizado la contraseña en la tabla `admin`
- Prueba regenerando el hash: `npm run hash-password`

### Error: "CORS error"

- Asegúrate que `VITE_API_URL` apunta a `http://localhost:5000/api`
- El servidor tiene CORS habilitado por defecto

---

## 🚀 Desplegar en Producción

### Render + Vercel (Recomendado)

#### Backend en Render:

1. Push tu código a GitHub
2. Conecta tu repo en https://render.com
3. Configura las variables de entorno (DB_HOST, DB_USER, etc.)
4. Deploy automático

#### Frontend en Vercel:

1. Conecta tu repo en https://vercel.com
2. Configura `VITE_API_URL` con la URL de Render
3. Deploy automático

### Variables de Entorno en Producción

⚠️ **IMPORTANTE**: Cambia estos valores en producción

```env
JWT_SECRET=generate-a-new-secure-random-key
NODE_ENV=production
VITE_API_URL=https://tu-backend.onrender.com/api
```

---

## 📖 Estructura del Proyecto

```
calculadorCostos/
├── server/
│   ├── index.js                 (Servidor Express)
│   ├── middleware/
│   │   └── auth.js             (Middleware de JWT)
│   ├── hashPassword.js          (Script para generar contraseña)
│   └── database.sql             (Schema y datos iniciales)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        (Página de login)
│   │   │   ├── AdminPanel.jsx   (Panel de administración)
│   │   │   └── Calculator.jsx   (Calculador público)
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── AdminPanel.css
│   │   │   └── Calculator.css
│   │   ├── App.jsx              (Enrutador principal)
│   │   └── main.jsx
│   └── vite.config.js
├── .env.example                 (Template de variables)
└── package.json
```

---

## 🔒 Seguridad

### Lo que está configurado:

✅ Contraseñas hasheadas con bcryptjs (salted)
✅ JWT para autenticación stateless
✅ Tokens con expiración (7 días)
✅ CORS configurado
✅ Endpoints protegidos (solo admin autenticado puede CRUD)

### Para mejorar en producción:

- Usar HTTPS obligatoriamente
- Cambiar `JWT_SECRET` a una clave aleatoria fuerte
- Implementar rate limiting
- Agregar validación más robusta
- Usar variables de entorno seguras

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar la contraseña del admin?**
R: Sí. Genera un nuevo hash con `npm run hash-password tu-nueva-contraseña` y actualiza en phpMyAdmin.

**P: ¿Dónde se guarda el token?**
R: En `localStorage` del navegador. Se borra al cerrar sesión.

**P: ¿Puedo agregar más administradores?**
R: Sí, desde phpMyAdmin: inserta una fila nueva en la tabla `admin`.

**P: ¿Qué ocurre si olvido la contraseña?**
R: Genera una nueva desde phpMyAdmin con el comando `npm run hash-password`.

---

¡Listo! Ya está todo configurado. 🎉