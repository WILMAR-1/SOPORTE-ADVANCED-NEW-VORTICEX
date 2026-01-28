<?php

// ------------------------------------------------------------
// ITLA Soporte - API Router (single entry point)
// Works both when deployed at:
//   http://localhost/<any-folder>/backend/public/api/...
// and when proxied from Vite at:
//   http://localhost:3000/api/...
// ------------------------------------------------------------

declare(strict_types=1);

// ==== CORS (DEV) ============================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    // If you're using Vite proxy, browser won't need CORS.
    // Still, keep it permissive for local testing.
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// ===========================================================================

// Cargar autoload de Composer (para las dependencias como firebase/jwt, dotenv, etc.)
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

// Cargar nuestras clases manualmente (no usamos autoload de Composer para estas)
require_once __DIR__ . '/../src/Utils/DotEnv.php';
require_once __DIR__ . '/../src/Config/Database.php';
require_once __DIR__ . '/../src/Utils/JWT.php';

require_once __DIR__ . '/../src/Models/User.php';
require_once __DIR__ . '/../src/Models/Ticket.php';

require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/UserController.php';
require_once __DIR__ . '/../src/Controllers/TicketController.php';
require_once __DIR__ . '/../src/Controllers/AIController.php';
require_once __DIR__ . '/../src/Middleware/AuthMiddleware.php';

use src\Controllers\AuthController;
use src\Controllers\UserController;
use src\Controllers\TicketController;
use src\Controllers\AIController;
use src\Utils\DotEnv;
use src\Utils\JWT;
use src\Middleware\AuthMiddleware;

try {
    // Load env (.env at backend root)
    DotEnv::load(__DIR__ . '/../.env');

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Full request path (no query string)
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

    // Dynamically detect where this index.php lives in the URL.
    // Example: SCRIPT_NAME = /itla-soporte-estudiantil/backend/public/index.php
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');

    // If this project is served from a subfolder, strip it.
    // /itla-soporte-estudiantil/backend/public/api/auth/login -> /api/auth/login
    if ($scriptDir !== '' && $scriptDir !== '/' && str_starts_with($path, $scriptDir)) {
        $path = substr($path, strlen($scriptDir));
        if ($path === '') $path = '/';
    }

    // Now strip the /api prefix.
    $apiPrefix = '/api';
    if (str_starts_with($path, $apiPrefix)) {
        $path = substr($path, strlen($apiPrefix));
        if ($path === '') $path = '/';
    }

    // Read JSON body safely
    $raw = file_get_contents('php://input');
    $data = [];
    if (is_string($raw) && trim($raw) !== '') {
        $json = json_decode($raw, true);
        if (is_array($json)) {
            $data = $json;
        } elseif (json_last_error() !== JSON_ERROR_NONE) {
            // Si hay error de JSON, intentar parsearlo de otra forma
            error_log('[API] JSON decode error: ' . json_last_error_msg() . ' | Raw: ' . substr($raw, 0, 100));
        }
    }

    // ==================== RUTAS PÚBLICAS ====================
    
    // Health check (sin autenticación)
    if ($path === '/health' && $method === 'GET') {
        echo json_encode(['ok' => true, 'time' => date('c')]);
        exit;
    }

    // Rutas de autenticación (públicas)
    if ($path === '/auth/login' && $method === 'POST') {
        (new AuthController())->login($data);
        exit;
    }

    if ($path === '/auth/register' && $method === 'POST') {
        (new AuthController())->register($data);
        exit;
    }

    // ==================== RUTAS PROTEGIDAS (requieren JWT) ====================
    
    // Obtener todos los usuarios (solo ADMIN)
    if ($path === '/users' && $method === 'GET') {
        $user = AuthMiddleware::requireRole('ADMIN');
        (new UserController())->getAll();
        exit;
    }

    // Actualizar usuario
    if (preg_match('#^/users/(\d+)$#', $path, $matches) && in_array($method, ['PUT', 'PATCH'])) {
        $user = AuthMiddleware::requireAuth();
        $id = (int)$matches[1];
        // Solo el mismo usuario o ADMIN puede actualizar
        if ($user['id'] != $id && $user['role'] !== 'ADMIN') {
            http_response_code(403);
            echo json_encode(['message' => 'No tiene permisos para actualizar este usuario']);
            exit;
        }
        (new UserController())->update($id, $data);
        exit;
    }

    // Eliminar usuario (solo ADMIN)
    if (preg_match('#^/users/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        AuthMiddleware::requireRole('ADMIN');
        $id = (int)$matches[1];
        (new UserController())->delete($id);
        exit;
    }

    // Obtener todos los tickets (requiere autenticación)
    if ($path === '/tickets' && $method === 'GET') {
        $user = AuthMiddleware::requireAuth();
        $role = $_GET['role'] ?? $user['role'];
        $userId = $_GET['userId'] ?? $user['id'];
        (new TicketController())->getAll($role, $userId);
        exit;
    }

    // Obtener un ticket específico
    if (preg_match('#^/tickets/(\d+)$#', $path, $matches) && $method === 'GET') {
        $user = AuthMiddleware::requireAuth();
        $ticketId = (int)$matches[1];
        (new TicketController())->getById($ticketId, $user);
        exit;
    }

    // Crear ticket (requiere autenticación)
    if ($path === '/tickets' && $method === 'POST') {
        $user = AuthMiddleware::requireAuth();
        // Asegurar que el user_id sea del usuario autenticado
        $data['user_id'] = $user['id'];
        (new TicketController())->create($data);
        exit;
    }

    // Actualizar ticket
    if (preg_match('#^/tickets/(\d+)$#', $path, $matches) && in_array($method, ['PUT', 'PATCH'])) {
        $user = AuthMiddleware::requireAuth();
        $ticketId = (int)$matches[1];
        (new TicketController())->update($ticketId, $data);
        exit;
    }

    // Agregar nota a un ticket
    if (preg_match('#^/tickets/(\d+)/notes$#', $path, $matches) && $method === 'POST') {
        $user = AuthMiddleware::requireAuth();
        $ticketId = (int)$matches[1];
        // Asegurar que el user_id sea del usuario autenticado
        $data['user_id'] = $user['id'];
        (new TicketController())->addNote($ticketId, $data);
        exit;
    }

    // ==================== RUTAS AI (requieren autenticación) ====================
    
    // Análisis de ticket con AI
    if ($path === '/ai/analyze' && $method === 'POST') {
        $user = AuthMiddleware::requireAuth();
        (new AIController())->analyze();
        exit;
    }

    // Respuesta inteligente con AI
    if ($path === '/ai/smart-response' && $method === 'POST') {
        $user = AuthMiddleware::requireAuth();
        (new AIController())->smartResponse();
        exit;
    }

    // Ruta no encontrada
    http_response_code(404);
    echo json_encode(['message' => 'Ruta no encontrada', 'path' => $path, 'method' => $method]);
} catch (Throwable $e) {
    http_response_code(500);
    
    // Asegurar que siempre devolvemos JSON válido
    header('Content-Type: application/json; charset=utf-8');
    
    // En desarrollo, mostrar más detalles del error
    $isDevelopment = ($_ENV['APP_ENV'] ?? 'development') === 'development';
    
    $errorResponse = [
        'message' => 'Error en el servidor',
        'error' => $e->getMessage(),
    ];
    
    if ($isDevelopment) {
        $errorResponse['file'] = basename($e->getFile());
        $errorResponse['line'] = $e->getLine();
        $errorResponse['trace'] = array_slice(explode("\n", $e->getTraceAsString()), 0, 5);
    }
    
    // Log del error en el servidor
    error_log('[API ERROR] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    
    echo json_encode($errorResponse, JSON_UNESCAPED_UNICODE);
    exit;
}
