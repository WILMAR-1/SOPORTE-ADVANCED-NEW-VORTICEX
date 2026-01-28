<?php
namespace src\Controllers;

use src\Models\User;
use src\Config\Database;
use src\Utils\JWT;

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        try {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        } catch (\PDOException $e) {
            // Si falla la conexión a la BD, responder con error claro
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'message' => 'Error de conexión a la base de datos',
                'error' => $e->getMessage(),
                'hint' => 'Verifica que MySQL esté corriendo y que la base de datos exista'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (\Throwable $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'message' => 'Error inicializando controlador',
                'error' => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    private function respond(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
        exit;
    }

    public function register($data): void {
        try {
            $name     = trim($data['name'] ?? '');
            $email    = trim($data['email'] ?? '');
            $password = (string)($data['password'] ?? '');

            if ($name === '' || $email === '' || $password === '') {
                $this->respond(["message" => "name, email y password son requeridos."], 400);
            }

            $this->user->name          = $name;
            $this->user->email         = $email;
            $this->user->password      = password_hash($password, PASSWORD_BCRYPT);
            $this->user->role          = $data['role'] ?? 'STUDENT';
            $this->user->matricula     = $data['matricula'] ?? null;
            $this->user->personal_email= $data['personal_email'] ?? null;
            $this->user->phone         = $data['phone'] ?? null;
            $this->user->career        = $data['career'] ?? null;

            if ($this->user->emailExists()) {
                $this->respond(["message" => "El correo ya existe."], 400);
            }

            if ($this->user->create()) {
                $this->respond(["message" => "Usuario registrado exitosamente."], 201);
            }

            $this->respond(["message" => "No se pudo registrar el usuario."], 503);
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error interno en registro", "error" => $e->getMessage()], 500);
        }
    }

    public function login($data): void {
        try {
            $email    = trim($data['email'] ?? '');
            $password = (string)($data['password'] ?? '');

            if ($email === '' || $password === '') {
                $this->respond(["message" => "email y password son requeridos."], 400);
            }

            $this->user->email = $email;
            $email_exists = $this->user->emailExists();

            if ($email_exists && password_verify($password, (string)$this->user->password)) {
                $now = time();
                $secret = (string)($_ENV['JWT_SECRET'] ?? 'dev_secret_change_me');

                $token = [
                    "iss" => $_ENV['APP_URL'] ?? "http://localhost",
                    "aud" => $_ENV['APP_URL'] ?? "http://localhost",
                    "iat" => $now,
                    "nbf" => $now,
                    "exp" => $now + (60 * 60 * 24), // 24 horas
                    "data" => [
                        "id"    => $this->user->id,
                        "name"  => $this->user->name,
                        "email" => $this->user->email,
                        "role"  => $this->user->role
                    ]
                ];

                $jwt = JWT::encode($token, $secret);

                $this->respond([
                    "message" => "Login exitoso",
                    "token" => $jwt,
                    "user" => [
                        "id" => $this->user->id,
                        "name" => $this->user->name,
                        "email" => $this->user->email,
                        "role" => $this->user->role,
                        "matricula" => $this->user->matricula ?? null,
                        "career" => $this->user->career ?? null,
                        "personalEmail" => $this->user->personal_email ?? null,
                        "phone" => $this->user->phone ?? null
                    ]
                ], 200);
            }

            $this->respond(["message" => "Credenciales inválidas."], 401);
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error interno en login", "error" => $e->getMessage()], 500);
        }
    }
}
