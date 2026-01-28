<?php
namespace src\Models;

use PDO;

class User {
    private $conn;
    private string $table_name = "users";
    private ?array $columnsCache = null;

    public $id;
    public $name;
    public $email;
    public $password;
    public $role;
    public $matricula;
    public $personal_email;
    public $phone;
    public $career;

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
            // Si falla, asumimos columnas mínimas
            $cols = ['id','name','email','password','role'];
        }

        $this->columnsCache = $cols;
        return $cols;
    }

    private function hasColumn(string $col): bool {
        return in_array($col, $this->columns(), true);
    }

    public function create(): bool {
        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $this->role,
            'matricula' => $this->matricula,
            'personal_email' => $this->personal_email,
            'phone' => $this->phone,
            'career' => $this->career
        ];

        // Filtrar solo columnas existentes
        $filtered = [];
        foreach ($data as $k => $v) {
            if ($this->hasColumn($k)) $filtered[$k] = $v;
        }

        if (empty($filtered)) return false;

        $cols = array_keys($filtered);
        $placeholders = array_map(fn($c) => ":" . $c, $cols);

        $query = "INSERT INTO {$this->table_name} (" . implode(',', $cols) . ")
                  VALUES (" . implode(',', $placeholders) . ")";

        $stmt = $this->conn->prepare($query);

        // Sanitize básicos
        if (isset($filtered['name']))  $filtered['name']  = htmlspecialchars(strip_tags((string)$filtered['name']));
        if (isset($filtered['email'])) $filtered['email'] = htmlspecialchars(strip_tags((string)$filtered['email']));
        if (isset($filtered['matricula'])) $filtered['matricula'] = htmlspecialchars(strip_tags((string)$filtered['matricula']));

        foreach ($filtered as $k => $v) {
            $stmt->bindValue(":" . $k, $v);
        }

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function emailExists(): bool {
        // Si tu tabla no tiene columna email, esto fallará; asumimos que sí la tiene.
        $query = "SELECT * FROM {$this->table_name} WHERE email = ? LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(1, $this->email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) return false;

        $this->id = $row['id'] ?? null;
        $this->name = $row['name'] ?? null;
        $this->password = $row['password'] ?? null;
        $this->role = $row['role'] ?? null;
        $this->matricula = $row['matricula'] ?? null;
        $this->career = $row['career'] ?? null;
        $this->personal_email = $row['personal_email'] ?? null;
        $this->phone = $row['phone'] ?? null;

        return true;
    }

    public function getAll() {
        // Evita depender de created_at si tu tabla no lo tiene
        $order = $this->hasColumn('created_at') ? 'created_at DESC' : 'id DESC';
        $query = "SELECT * FROM {$this->table_name} ORDER BY {$order}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
