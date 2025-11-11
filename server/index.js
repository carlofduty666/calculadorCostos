import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexión MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'calculador_costos',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ========== AUTENTICACIÓN ==========

// POST - Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    const connection = await pool.getConnection();
    const [admins] = await connection.query('SELECT * FROM admin WHERE username = ?', [username]);
    connection.release();

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login exitoso' });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST - Logout (solo confirma, el token se invalida en cliente)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

// ========== RUTAS DE ITEMS ==========

// GET - Obtener todos los items (público)
app.get('/api/items', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query('SELECT * FROM items ORDER BY nombre ASC');
    connection.release();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// GET - Obtener un item por ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    connection.release();
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Error fetching item' });
  }
});

// POST - Crear nuevo item (SOLO ADMIN)
app.post('/api/items', verifyToken, async (req, res) => {
  const { nombre, precio, descripcion } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO items (nombre, precio, descripcion) VALUES (?, ?, ?)',
      [nombre, precio, descripcion || null]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, nombre, precio, descripcion });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error creating item' });
  }
});

// PUT - Actualizar item (SOLO ADMIN)
app.put('/api/items/:id', verifyToken, async (req, res) => {
  const { nombre, precio, descripcion } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE items SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?',
      [nombre, precio, descripcion || null, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, nombre, precio, descripcion });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

// DELETE - Eliminar item (SOLO ADMIN)
app.delete('/api/items/:id', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// POST - Calcular total
app.post('/api/calcular', (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items debe ser un array' });
  }

  const total = items.reduce((sum, item) => sum + (item.precio || 0), 0);
  const cantidad = items.length;

  res.json({
    cantidad,
    subtotal: total,
    impuesto: total * 0.16, // Ajusta según necesidad
    total: total * 1.16,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});