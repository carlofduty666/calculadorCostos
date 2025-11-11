-- Crear base de datos
CREATE DATABASE IF NOT EXISTS calculador_costos;
USE calculador_costos;

-- Crear tabla de items
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de administrador
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar admin por defecto (usuario: admin, contraseña: admin123)
-- La contraseña está hasheada con bcrypt
INSERT INTO admin (username, password, email) VALUES
('admin', '$2a$10$SKC/WL4jZ9o9cft3N2JZyO4ZnHmNJbTsKmlpgHHNEuffmL7W5nmg2', 'admin@example.com')
ON DUPLICATE KEY UPDATE username=username;

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  items JSON,
  total DECIMAL(10, 2),
  google_event_id VARCHAR(255),
  status ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO items (nombre, precio, descripcion) VALUES
('Servicio A', 100.00, 'Descripción del servicio A'),
('Servicio B', 150.00, 'Descripción del servicio B'),
('Servicio C', 200.00, 'Descripción del servicio C'),
('Servicio D', 75.50, 'Descripción del servicio D'),
('Servicio E', 125.00, 'Descripción del servicio E');