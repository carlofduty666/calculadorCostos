# 💰 Calculador de Costos

Una aplicación web para calcular costos y proporcionar estimados finales según los ítems seleccionados. Incluye panel de administración privado para gestionar items.

## ✨ Características

✅ **Calculador Público** - Selecciona items y calcula totales en tiempo real
✅ **Panel de Admin Protegido** - Solo el cliente puede agregar, editar y eliminar items
✅ **Autenticación JWT** - Seguridad con usuario + contraseña
✅ **Interfaz Moderna** - Diseño responsivo para desktop y móvil
✅ **API REST Completa** - Endpoints seguros y protegidos
✅ **Base de Datos MySQL** - Almacenamiento persistente

## 🎯 Estructura

### 🌐 Página Pública: `/`
- Ver lista de items
- Seleccionar múltiples items con checkboxes
- Cálculo automático de totales e impuestos
- Link de acceso al admin

### 🔐 Panel Admin: `/admin`
- Protegido con autenticación JWT
- **Ver**: Lista completa de items
- **Crear**: Agregar nuevos items
- **Editar**: Modificar precios y descripciones
- **Eliminar**: Remover items
- **Logout**: Cerrar sesión

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
cd client && npm install && cd ..
```

### 2. Configurar Base de Datos

Importa `server/database.sql` en phpMyAdmin o MySQL

### 3. Generar contraseña del admin

```bash
npm run hash-password admin123
```

Copia el hash generado y actualiza en phpMyAdmin (tabla `admin`)

### 4. Configurar `.env`

```bash
cp .env.example .env
```

Edita con tus valores de MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=calculador_costos
JWT_SECRET=tu-clave-super-secreta
VITE_API_URL=http://localhost:5000/api
```

### 5. Iniciar

```bash
npm run dev
```

**Abre:**
- Calculador: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- Backend: http://localhost:5000

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📋 Requisitos

- Node.js 16+
- MySQL 5.7+

## 📖 Documentación Completa

Ver [SETUP.md](./SETUP.md) para instrucciones detalladas de instalación, troubleshooting y despliegue.

## 📚 Scripts Disponibles

```bash
npm run dev              # Inicia servidor + cliente
npm run server:dev      # Solo servidor (con nodemon)
npm run server:start    # Servidor para producción
npm run client:dev      # Solo cliente Vite
npm run client:build    # Build optimizado para prod
npm run hash-password   # Generar hash de contraseña
```

## 🏗️ Estructura del Proyecto

```
calculadorCostos/
├── server/
│   ├── index.js                 # Servidor Express + rutas
│   ├── middleware/
│   │   └── auth.js             # Middleware JWT
│   ├── hashPassword.js          # Generador de contraseñas
│   └── database.sql             # Schema y datos iniciales
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Página login
│   │   │   ├── AdminPanel.jsx   # Panel admin
│   │   │   └── Calculator.jsx   # Calculador público
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── AdminPanel.css
│   │   │   └── Calculator.css
│   │   ├── App.jsx              # Router principal
│   │   └── main.jsx
│   └── vite.config.js
├── .env.example         # Template
├── SETUP.md            # Guía detallada
└── package.json
```

## 🔗 API Endpoints

### 🔓 Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/items` | Listar todos los items |
| `GET` | `/api/items/:id` | Obtener item específico |
| `POST` | `/api/calcular` | Calcular total |
| `GET` | `/api/health` | Health check |

### 🔐 Solo Admin (Requiere JWT Token)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/items` | Crear item |
| `PUT` | `/api/items/:id` | Actualizar item |
| `DELETE` | `/api/items/:id` | Eliminar item |

### 🔑 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login (retorna JWT) |
| `POST` | `/api/auth/logout` | Logout |

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con **bcryptjs**
- ✅ **JWT** con expiración (7 días)
- ✅ **CORS** configurado
- ✅ Endpoints protegidos con middleware
- ✅ Validación de entrada

## 📤 Desplegar

### Render + Vercel (Recomendado)

**Backend (Render):**
- Push a GitHub
- Conecta en https://render.com
- Configura ENV vars

**Frontend (Vercel):**
- Conecta en https://vercel.com
- Configura `VITE_API_URL` con URL de Render
- Deploy automático

Ver [SETUP.md](./SETUP.md) para más detalles de despliegue.

## 🆘 Solucionar Problemas

### ❌ "Error: Cannot find module"
```bash
npm install && cd client && npm install && cd ..
```

### ❌ "ECONNREFUSED" en MySQL
- Verifica que MySQL esté corriendo
- En XAMPP: Start MySQL desde el panel

### ❌ "Token inválido"
- Regenera la contraseña: `npm run hash-password`
- Actualiza en phpMyAdmin

Ver [SETUP.md](./SETUP.md) para más soluciones.

## 💡 Ejemplo de Uso

### Login

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await response.json();
localStorage.setItem('token', token);
```

### Crear Item (Con Autenticación)

```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre: 'Nuevo Servicio',
    precio: 500,
    descripcion: 'Descripción'
  })
});
```

### Calcular Total (Público)

```javascript
const response = await fetch('http://localhost:5000/api/calcular', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { id: 1, precio: 100 },
      { id: 2, precio: 150 }
    ]
  })
});
const { cantidad, subtotal, impuesto, total } = await response.json();
```

## ❓ FAQ

**P: ¿Cómo cambio la contraseña del admin?**
R: Ejecuta `npm run hash-password tu-nueva-contraseña` y actualiza en phpMyAdmin.

**P: ¿Puedo tener múltiples admins?**
R: Sí, inserta registros en la tabla `admin`.

**P: ¿Dónde se guarda el token?**
R: En `localStorage` del navegador. Se borra al logout.

**P: ¿Cómo cambio el porcentaje de impuestos?**
R: En `server/index.js`, línea 127: `total * 0.16` (cambiar 0.16)

## 📄 Licencia

MIT

---

**Preguntas o problemas?** Ver [SETUP.md](./SETUP.md) para documentación completa.