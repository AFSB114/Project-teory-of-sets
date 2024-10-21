<?php
class Connection {
    private PDO $pdo;

    public function __construct(
        private string $host = "localhost",
        private string $db = "vennture",
        private string $user = "postgres",
        private string $password = "Af300407",
        private string $port = "5432"
    ) {
        $dsn = "pgsql:host=$this->host;port=$this->port;dbname=$this->db;";

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