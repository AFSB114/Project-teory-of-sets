<?php

class DataUsers
{
    protected string $query;

    public function __construct(
        protected int        $id,
        protected Connection $dbConnection
    )
    {
        $this->query = "SELECT l.nickname, c.profileurl AS avatar FROM log l INNER JOIN users u ON u.id = l.id INNER JOIN character c ON c.id = u.character_id WHERE l.id = :id";
    }

    public function getData(): array
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query);
            $stmt->execute([
                'id' => $this->id,
            ]);

            $res = ["status" => true, "data" => $stmt->fetch(PDO::FETCH_ASSOC)];

        } catch (PDOException $error) {
            $res = ['status' => false, 'message' => 'Error de conexión', 'error' => $error];

        } finally {
            return $res;
        }
    }
}