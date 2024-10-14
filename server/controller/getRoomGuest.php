<?php

class GetRoomGuest
{
    protected string $query;

    public function __construct(
        protected int                $roomId,
        protected DatabaseConnection $dbConnection
    )
    {
        $this->query = "SELECT data FROM user_room WHERE rol_id = 4 AND room_id = :room_id";
    }

    public function getRoomGuest(): array | Res
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query);
            $stmt->execute([
                "room_id" => $this->roomId
            ]);

            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $error) {
            $res = new Res('error', 'Error de conexión', $error);

        } finally {
            return $res;
        }
    }
}