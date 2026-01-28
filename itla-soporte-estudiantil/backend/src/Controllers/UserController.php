<?php
namespace src\Controllers;

use src\Models\User;
use src\Config\Database;

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    private function respond($data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
        exit;
    }

    public function getAll(): void {
        try {
            $stmt = $this->user->getAll();
            $users = [];

            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                $users[] = [
                    "id" => (string)($row['id'] ?? ''),
                    "name" => $row['name'] ?? null,
                    "email" => $row['email'] ?? null,
                    "role" => $row['role'] ?? null,
                    "matricula" => $row['matricula'] ?? null,
                    "career" => $row['career'] ?? null,
                    "personalEmail" => $row['personal_email'] ?? null,
                    "phone" => $row['phone'] ?? null,
                    "createdAt" => $row['created_at'] ?? null,
                    "updatedAt" => $row['updated_at'] ?? null,
                ];
            }

            $this->respond($users, 200);
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error retrieving users", "error" => $e->getMessage()], 500);
        }
    }

    public function update($id, $data): void {
        // TODO: implementar update real si lo necesitas
        $this->respond(["message" => "Usuario actualizado (pendiente de implementación)"], 200);
    }

    public function delete($id): void {
        try {
            $query = "DELETE FROM users WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(":id", $id, \PDO::PARAM_INT);

            if ($stmt->execute()) {
                $this->respond(["message" => "Usuario eliminado"], 200);
            }

            $this->respond(["message" => "No se pudo eliminar"], 503);
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error eliminando usuario", "error" => $e->getMessage()], 500);
        }
    }
}
