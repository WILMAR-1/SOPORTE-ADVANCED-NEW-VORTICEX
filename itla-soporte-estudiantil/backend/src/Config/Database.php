<?php
namespace src\Config;

use PDO;
use PDOException;

class Database {
    /** @var PDO|null */
    private static ?PDO $instance = null;

    private string $host;
    private string $dbName;
    private string $username;
    private string $password;
    private int $port;
    private ?string $socket;
    private array $options;

    public function __construct() {
        $this->host     = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $this->dbName   = $_ENV['DB_NAME'] ?? 'itla_soporte';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
        $this->port     = isset($_ENV['DB_PORT']) && is_numeric($_ENV['DB_PORT']) ? (int)$_ENV['DB_PORT'] : 3306;
        $this->socket   = $_ENV['DB_SOCKET'] ?? null;

        $this->options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            // En XAMPP es mejor NO usar persistent para evitar "server has gone away" raros
            PDO::ATTR_PERSISTENT         => false,
        ];
    }

    private function buildDsn(): string {
        if ($this->socket) {
            return "mysql:unix_socket={$this->socket};dbname={$this->dbName};charset=utf8mb4";
        }
        return "mysql:host={$this->host};port={$this->port};dbname={$this->dbName};charset=utf8mb4";
    }

    public function getConnection(): PDO {
        if (self::$instance instanceof PDO) {
            // Revalida conexión (si MySQL se cayó o cerró)
            if (!self::ping()) {
                self::close();
            } else {
                return self::$instance;
            }
        }

        try {
            self::$instance = new PDO($this->buildDsn(), $this->username, $this->password, $this->options);
            return self::$instance;
        } catch (PDOException $e) {
            error_log('[DB ERROR] ' . $e->getMessage() . ' | DSN: ' . $this->buildDsn());
            // Lanza para que el controller responda JSON 500 en vez de quedar $db = null
            throw $e;
        }
    }

    public static function ping(): bool {
        try {
            if (!(self::$instance instanceof PDO)) return false;
            self::$instance->query('SELECT 1');
            return true;
        } catch (\Throwable $e) {
            error_log('[DB PING ERROR] ' . $e->getMessage());
            return false;
        }
    }

    public static function close(): void {
        self::$instance = null;
    }
}
