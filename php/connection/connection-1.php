<?php
class DatabaseConnection {
    private string $host = "localhost";
    private string $db = "vennture";
    private string $user = "postgres";
    private string $password = "Af300407";
    private string $port = "5432";
    private PDO $pdo;

    public function __construct() {
        $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->db};";

        try {
            $this->pdo = new PDO(
                $dsn,
                $this->user,
                $this->password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $err) {
            die("Error de conexión: " . $err->getMessage());
        }
    }

    public function connection(): PDO
    {
        return $this->pdo;
    }
}

// Ejemplo de uso:
// $db = new DatabaseConnection();
// $conn = $db->getConnection();