<?php

class GetAdminRoom
{
    protected string $query;

    public function __construct(
        protected int                $roomId,
        protected Connection $dbConnection
    )
    {
        $this->query = "SELECT data FROM user_room WHERE rol_id = 3 AND room_id = :room_id";
    }

    public function getAdminRoom(): Res|array
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query);
            $stmt->execute([
                "room_id" => $this->roomId
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $error) {
            $res = new Res('error', 'Error de conexión', $error);

        } finally {
            return $res;
        }
    }
}