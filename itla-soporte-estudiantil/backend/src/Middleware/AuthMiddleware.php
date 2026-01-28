<?php
namespace src\Middleware;

use src\Utils\JWT;

class AuthMiddleware {
    /**
     * Valida el token JWT y retorna los datos del usuario
     * @return array|null Retorna el payload del token o null si es inválido
     */
    public static function validateToken(): ?array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        // También intentar obtener desde REDIRECT_HTTP_AUTHORIZATION (para Apache)
        if (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if (empty($authHeader)) {
            return null;
        }

        // Bearer token
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        } else {
            $token = $authHeader;
        }

        $secret = (string)($_ENV['JWT_SECRET'] ?? 'dev_secret_change_me');
        $payload = JWT::decode($token, $secret);

        return $payload;
    }

    /**
     * Requiere autenticación. Si falla, retorna respuesta 401 y termina ejecución
     */
    public static function requireAuth(): ?array {
        $payload = self::validateToken();
        
        if (!$payload || !isset($payload['data'])) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['message' => 'Token inválido o expirado. Por favor, inicie sesión nuevamente.']);
            exit;
        }

        return $payload['data'];
    }

    /**
     * Requiere un rol específico
     */
    public static function requireRole(string $requiredRole): ?array {
        $user = self::requireAuth();
        
        if ($user['role'] !== $requiredRole && $user['role'] !== 'ADMIN') {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['message' => 'No tiene permisos para realizar esta acción.']);
            exit;
        }

        return $user;
    }

    /**
     * Requiere uno de varios roles
     */
    public static function requireAnyRole(array $roles): ?array {
        $user = self::requireAuth();
        
        if (!in_array($user['role'], $roles, true) && $user['role'] !== 'ADMIN') {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['message' => 'No tiene permisos para realizar esta acción.']);
            exit;
        }

        return $user;
    }
}
