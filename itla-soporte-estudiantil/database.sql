-- ============================================
-- Base de Datos: ITLA Soporte Estudiantil
-- Sistema de Gestión de Tickets
-- ============================================
-- 
-- INSTRUCCIONES PARA MYSQL WORKBENCH:
-- 1. Abre MySQL Workbench
-- 2. Conéctate a tu servidor MySQL (no XAMPP, el MySQL independiente)
-- 3. Abre este archivo SQL
-- 4. Ejecuta todo el script (Ctrl+Shift+Enter o el botón Execute)
-- 5. Verifica que la base de datos "itla_soporte" se haya creado correctamente
--
-- IMPORTANTE: Si ya existe la base de datos, este script no la borrará.
-- Si quieres empezar desde cero, primero ejecuta: DROP DATABASE IF EXISTS itla_soporte;
-- ============================================

-- Crear base de datos (compatible con MySQL Workbench)
DROP DATABASE IF EXISTS itla_soporte;
CREATE DATABASE itla_soporte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE itla_soporte;

-- ============================================
-- Tabla: users
-- Almacena todos los usuarios del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'TECNOLOGIA', 'DTE', 'SEGURIDAD') NOT NULL DEFAULT 'STUDENT',
    matricula VARCHAR(50) NULL,
    personal_email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    career VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: tickets
-- Almacena todos los tickets de soporte
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assigned_to INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('SIGEI_PASS', 'VIRTUAL_PASS', 'EMAIL_PASS', 'ACADEMIC_REQUEST', 'OTHER') NOT NULL,
    status ENUM('Abierto', 'En Proceso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Abierto',
    priority VARCHAR(20) NULL DEFAULT 'Media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: ticket_notes
-- Almacena las notas/comentarios de los tickets
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NULL,
    text TEXT NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insertar usuario administrador por defecto
-- Password: admin123 (hashed con bcrypt)
-- 
-- Credenciales de acceso:
-- Email: admin@itla.edu.do
-- Password: admin123
-- ============================================
INSERT INTO users (name, email, password, role, created_at) 
VALUES (
    'Administrador Maestro',
    'admin@itla.edu.do',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- password: admin123
    'ADMIN',
    NOW()
);

-- ============================================
-- Insertar usuarios de ejemplo para testing
-- ============================================
INSERT INTO users (name, email, password, role, matricula, personal_email, phone, career, created_at) 
VALUES 
(
    'Juan Pérez García',
    'juan.perez@itla.edu.do',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- password: admin123
    'STUDENT',
    '2023-0123',
    'juan.perez@gmail.com',
    '809-555-1234',
    'Desarrollo de Software',
    NOW()
),
(
    'María González',
    'maria.gonzalez@itla.edu.do',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TECNOLOGIA',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
),
(
    'Carlos Rodríguez',
    'carlos.rodriguez@itla.edu.do',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'DTE',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
),
(
    'Ana Martínez',
    'ana.martinez@itla.edu.do',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'SEGURIDAD',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
);

-- ============================================
-- Vista para tickets con información del usuario
-- ============================================
CREATE OR REPLACE VIEW tickets_with_users AS
SELECT 
    t.*,
    u.name as user_name,
    u.email as user_email,
    u.matricula as user_matricula,
    assigned.name as assigned_name,
    assigned.email as assigned_email
FROM tickets t
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN users assigned ON t.assigned_to = assigned.id;

-- ============================================
-- Estadísticas básicas
-- ============================================
SELECT 'Base de datos creada exitosamente!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_tickets FROM tickets;
