<?php
namespace src\Models;

use PDO;

class Ticket {
    private $conn;
    private string $table_name = "tickets";
    private ?array $columnsCache = null;

    public $id;
    public $user_id;
    public $assigned_to;
    public $title;
    public $description;
    public $category;
    public $status;
    public $priority;

    public function __construct($db) {
        $this->conn = $db;
    }

    private function columns(): array {
        if (is_array($this->columnsCache)) return $this->columnsCache;

        $cols = [];
        try {
            $stmt = $this->conn->query("SHOW COLUMNS FROM {$this->table_name}");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (!empty($row['Field'])) $cols[] = $row['Field'];
            }
        } catch (\Throwable $e) {
            $cols = ['id','user_id','title','description','category','status','priority','assigned_to'];
        }

        $this->columnsCache = $cols;
        return $cols;
    }

    private function hasColumn(string $col): bool {
        return in_array($col, $this->columns(), true);
    }

    public function create() {
        $data = [
            'user_id' => $this->user_id,
            'assigned_to' => $this->assigned_to,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'status' => $this->status,
            'priority' => $this->priority,
        ];

        $filtered = [];
        foreach ($data as $k => $v) {
            if ($this->hasColumn($k)) $filtered[$k] = $v;
        }

        $cols = array_keys($filtered);
        $placeholders = array_map(fn($c) => ":" . $c, $cols);

        $query = "INSERT INTO {$this->table_name} (" . implode(',', $cols) . ")
                  VALUES (" . implode(',', $placeholders) . ")";

        $stmt = $this->conn->prepare($query);
        foreach ($filtered as $k => $v) {
            $stmt->bindValue(":" . $k, $v);
        }

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function getAll($role, $userId = null, $category = null) {
        $query = "SELECT t.*, u.name as user_name, u2.name as assigned_name
                  FROM {$this->table_name} t
                  LEFT JOIN users u ON t.user_id = u.id
                  LEFT JOIN users u2 ON t.assigned_to = u2.id
                  WHERE 1=1";

        if ($role === 'STUDENT') {
            $query .= " AND t.user_id = :user_id";
        } elseif ($role === 'TECNOLOGIA') {
            $query .= " AND t.category = 'SIGEI_PASS'";
        } elseif ($role === 'DTE') {
            $query .= " AND t.category = 'VIRTUAL_PASS'";
        } elseif ($role === 'SEGURIDAD') {
            $query .= " AND t.category = 'EMAIL_PASS'";
        }

        // No dependas de created_at si no existe
        $order = $this->hasColumn('created_at') ? 't.created_at DESC' : 't.id DESC';
        $query .= " ORDER BY {$order}";

        $stmt = $this->conn->prepare($query);

        if ($role === 'STUDENT') {
            $stmt->bindValue(":user_id", $userId, \PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt;
    }

    public function update(): bool {
        $query = "UPDATE {$this->table_name}
                  SET status = :status,
                      assigned_to = :assigned_to,
                      category = :category
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":status", $this->status);
        $stmt->bindValue(":assigned_to", $this->assigned_to);
        $stmt->bindValue(":category", $this->category);
        $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);

        return $stmt->execute();
    }
}
