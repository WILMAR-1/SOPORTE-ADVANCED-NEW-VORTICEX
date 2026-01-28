<?php
namespace src\Controllers;

use src\Models\Ticket;
use src\Models\User;
use src\Config\Database;

class TicketController {
    private $db;
    private $ticket;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->ticket = new Ticket($this->db);
        $this->user = new User($this->db);
    }

    private function respond($data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
        exit;
    }

    public function create($data): void {
        try {
            // Validar campos requeridos
            if (empty($data['user_id'])) {
                $this->respond(["message" => "user_id es requerido"], 400);
                return;
            }
            
            if (empty($data['title']) || empty($data['description'])) {
                $this->respond(["message" => "title y description son requeridos"], 400);
                return;
            }

            // Mapear categoría del frontend a código de BD
            $categoryMap = [
                'Incidente de contraseña SIGEI' => 'SIGEI_PASS',
                'Incidente de contraseña plataforma virtual' => 'VIRTUAL_PASS',
                'Incidente de contraseña correo' => 'EMAIL_PASS',
                'Solicitud Académica' => 'ACADEMIC_REQUEST',
                'Otros' => 'OTHER',
                // También aceptar códigos directamente
                'SIGEI_PASS' => 'SIGEI_PASS',
                'VIRTUAL_PASS' => 'VIRTUAL_PASS',
                'EMAIL_PASS' => 'EMAIL_PASS',
                'ACADEMIC_REQUEST' => 'ACADEMIC_REQUEST',
                'OTHER' => 'OTHER'
            ];
            
            $categoryInput = $data['category'] ?? 'OTHER';
            $categoryCode = $categoryMap[$categoryInput] ?? 'OTHER';

            $this->ticket->user_id     = (int)$data['user_id'];
            $this->ticket->assigned_to = isset($data['assigned_to']) ? (int)$data['assigned_to'] : null;
            $this->ticket->title       = trim($data['title']);
            $this->ticket->description = trim($data['description']);
            $this->ticket->category    = $categoryCode;
            $this->ticket->status      = $data['status'] ?? 'Abierto';
            $this->ticket->priority    = $data['priority'] ?? 'Media';

            $id = $this->ticket->create();

            if ($id) {
                $this->respond([
                    "message" => "Ticket creado exitosamente", 
                    "id" => (string)$id  // Convertir a string para el frontend
                ], 201);
            } else {
            $this->respond(["message" => "No se pudo crear el ticket"], 503);
            }
        } catch (\Throwable $e) {
            error_log('[TICKET CREATE ERROR] ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
            $this->respond([
                "message" => "Error creando ticket", 
                "error" => $e->getMessage(),
                "file" => basename($e->getFile()),
                "line" => $e->getLine()
            ], 500);
        }
    }

    public function getById($ticketId, $user): void {
        try {
            $query = "SELECT t.*, u.name as user_name, u2.name as assigned_name
                      FROM tickets t
                      LEFT JOIN users u ON t.user_id = u.id
                      LEFT JOIN users u2 ON t.assigned_to = u2.id
                      WHERE t.id = :id LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $ticketId, \PDO::PARAM_INT);
            $stmt->execute();
            
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!$row) {
                $this->respond(["message" => "Ticket no encontrado"], 404);
                return;
            }
            
            // Verificar permisos: el usuario es el creador, está asignado, o es ADMIN/TECNOLOGIA/DTE/SEGURIDAD
            $canAccess = false;
            if ($user['role'] === 'ADMIN') {
                $canAccess = true;
            } elseif ((int)$row['user_id'] === (int)$user['id']) {
                $canAccess = true;
            } elseif ((int)$row['assigned_to'] === (int)$user['id']) {
                $canAccess = true;
            } elseif (in_array($user['role'], ['TECNOLOGIA', 'DTE', 'SEGURIDAD'])) {
                // Verificar si el ticket pertenece a su categoría
                $categoryRoleMap = [
                    'SIGEI_PASS' => 'TECNOLOGIA',
                    'VIRTUAL_PASS' => 'DTE',
                    'EMAIL_PASS' => 'SEGURIDAD'
                ];
                if (isset($categoryRoleMap[$row['category']]) && $categoryRoleMap[$row['category']] === $user['role']) {
                    $canAccess = true;
                }
            }
            
            if (!$canAccess) {
                $this->respond(["message" => "No tiene permisos para ver este ticket"], 403);
                return;
            }
            
            // Obtener notas
            $notes = $this->getTicketNotes($ticketId);
            
            // Mapear categoría de BD a texto del frontend
            $categoryMap = [
                'SIGEI_PASS' => 'Incidente de contraseña SIGEI',
                'VIRTUAL_PASS' => 'Incidente de contraseña plataforma virtual',
                'EMAIL_PASS' => 'Incidente de contraseña correo',
                'ACADEMIC_REQUEST' => 'Solicitud Académica',
                'OTHER' => 'Otros'
            ];
            $categoryText = $categoryMap[$row['category']] ?? $row['category'];
            
            $ticket = [
                "id"           => (string)($row['id'] ?? ''),
                "userId"       => (string)($row['user_id'] ?? ''),
                "userName"     => $row['user_name'] ?? 'Usuario',
                "assignedTo"   => $row['assigned_to'] ? (string)$row['assigned_to'] : null,
                "assignedName" => $row['assigned_name'] ?? null,
                "title"        => $row['title'] ?? '',
                "description"  => $row['description'] ?? '',
                "category"     => $categoryText,
                "status"       => $row['status'] ?? null,
                "priority"     => $row['priority'] ?? null,
                "createdAt"    => $row['created_at'] ?? null,
                "updatedAt"    => $row['updated_at'] ?? null,
                "notes"        => $notes
            ];
            
            $this->respond($ticket, 200);
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error retrieving ticket", "error" => $e->getMessage()], 500);
        }
    }

    private function getTicketNotes($ticketId): array {
                $notes = [];
        $q = "SELECT id, ticket_id, user_id, text, is_system, created_at
                      FROM ticket_notes
                      WHERE ticket_id = :tid
                      ORDER BY id ASC";

                $notesStmt = $this->db->prepare($q);
        $notesStmt->bindValue(':tid', (int)$ticketId, \PDO::PARAM_INT);

                if ($notesStmt->execute()) {
                    while ($note = $notesStmt->fetch(\PDO::FETCH_ASSOC)) {
                        $authorName = "Sistema";
                        $authorRole = "ADMIN";

                        $noteUserId = $note['user_id'] ?? null;
                        if (!empty($noteUserId)) {
                            $uStmt = $this->db->prepare("SELECT name, role FROM users WHERE id = :uid LIMIT 1");
                            $uStmt->bindValue(':uid', (int)$noteUserId, \PDO::PARAM_INT);
                            if ($uStmt->execute()) {
                                $uData = $uStmt->fetch(\PDO::FETCH_ASSOC);
                                if ($uData) {
                                    $authorName = $uData['name'] ?? $authorName;
                                    $authorRole = $uData['role'] ?? $authorRole;
                                }
                            }
                        }

                        $notes[] = [
                    "id"        => (string)($note['id'] ?? ''),
                            "text"      => $note['text'] ?? '',
                            "author"    => $authorName,
                            "role"      => $authorRole,
                            "createdAt" => $note['created_at'] ?? null
                        ];
                    }
                }
        
        return $notes;
    }

    public function getAll($role, $userId): void {
        try {
            $stmt = $this->ticket->getAll($role, $userId);
            $tickets = [];

            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                // Obtener notas usando el método helper
                $notes = $this->getTicketNotes((int)($row['id'] ?? 0));

                // Mapear categoría de BD a texto del frontend
                $categoryMap = [
                    'SIGEI_PASS' => 'Incidente de contraseña SIGEI',
                    'VIRTUAL_PASS' => 'Incidente de contraseña plataforma virtual',
                    'EMAIL_PASS' => 'Incidente de contraseña correo',
                    'ACADEMIC_REQUEST' => 'Solicitud Académica',
                    'OTHER' => 'Otros'
                ];
                $categoryText = $categoryMap[$row['category']] ?? $row['category'];

                $tickets[] = [
                    "id"           => (string)($row['id'] ?? ''),
                    "userId"       => (string)($row['user_id'] ?? ''),
                    "userName"     => $row['user_name'] ?? 'Usuario',
                    "assignedTo"   => $row['assigned_to'] ? (string)$row['assigned_to'] : null,
                    "assignedName" => $row['assigned_name'] ?? null,
                    "title"        => $row['title'] ?? '',
                    "description"  => $row['description'] ?? '',
                    "category"     => $categoryText,
                    "status"       => $row['status'] ?? null,
                    "priority"     => $row['priority'] ?? null,
                    "createdAt"    => $row['created_at'] ?? null,
                    "updatedAt"    => $row['updated_at'] ?? null,
                    "notes"        => $notes
                ];
            }

            $this->respond($tickets, 200);

        } catch (\Throwable $e) {
            $this->respond(["message" => "Error retrieving tickets", "error" => $e->getMessage()], 500);
        }
    }

    public function update($id, $data): void {
        try {
            // Verificar que el ticket existe
            $checkStmt = $this->db->prepare("SELECT user_id, assigned_to, category FROM tickets WHERE id = :id LIMIT 1");
            $checkStmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
            $checkStmt->execute();
            $ticket = $checkStmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!$ticket) {
                $this->respond(["message" => "Ticket no encontrado"], 404);
                return;
            }
            
            // Construir query de actualización dinámicamente
            $updates = [];
            $params = [':id' => (int)$id];
            
            if (isset($data['status'])) {
                $updates[] = "status = :status";
                $params[':status'] = $data['status'];
            }
            
            if (isset($data['assignedTo'])) {
                $updates[] = "assigned_to = :assigned_to";
                $params[':assigned_to'] = !empty($data['assignedTo']) ? (int)$data['assignedTo'] : null;
            }
            
            if (isset($data['category'])) {
                $updates[] = "category = :category";
                $params[':category'] = $data['category'];
            }
            
            if (isset($data['title'])) {
                $updates[] = "title = :title";
                $params[':title'] = $data['title'];
            }
            
            if (isset($data['description'])) {
                $updates[] = "description = :description";
                $params[':description'] = $data['description'];
            }
            
            if (isset($data['priority'])) {
                $updates[] = "priority = :priority";
                $params[':priority'] = $data['priority'];
            }
            
            if (empty($updates)) {
                $this->respond(["message" => "No hay campos para actualizar"], 400);
                return;
            }
            
            $query = "UPDATE tickets SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $this->db->prepare($query);
            
            foreach ($params as $key => $value) {
                if ($value === null) {
                    $stmt->bindValue($key, null, \PDO::PARAM_NULL);
                } else {
                    $stmt->bindValue($key, $value);
                }
            }
            
            if ($stmt->execute()) {
                $this->respond(["message" => "Ticket actualizado exitosamente"], 200);
            } else {
                $this->respond(["message" => "No se pudo actualizar el ticket"], 503);
            }
        } catch (\Throwable $e) {
            $this->respond(["message" => "Error actualizando ticket", "error" => $e->getMessage()], 500);
        }
    }

    public function addNote($ticketId, $data): void {
        $userId   = $data['user_id'] ?? null;
        $text     = trim($data['text'] ?? '');
        $isSystem = (int)($data['is_system'] ?? 0);

        if ($text === '') {
            $this->respond(["message" => "El texto de la nota es requerido"], 400);
        }

        try {
            $stmt = $this->db->prepare(
                "INSERT INTO ticket_notes (ticket_id, user_id, text, is_system)
                 VALUES (:ticket_id, :user_id, :text, :is_system)"
            );

            $stmt->bindValue(":ticket_id", (int)$ticketId, \PDO::PARAM_INT);

            if ($userId) {
                $stmt->bindValue(":user_id", (int)$userId, \PDO::PARAM_INT);
            } else {
                $stmt->bindValue(":user_id", null, \PDO::PARAM_NULL);
            }

            $stmt->bindValue(":text", $text, \PDO::PARAM_STR);
            $stmt->bindValue(":is_system", $isSystem, \PDO::PARAM_INT);

            if ($stmt->execute()) {
                $this->respond(["message" => "Nota añadida"], 201);
            }

            $this->respond(["message" => "Error al guardar nota"], 500);

        } catch (\Throwable $e) {
            $this->respond(["message" => "Database error", "error" => $e->getMessage()], 500);
        }
    }
}
