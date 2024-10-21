<?php

class GetDataGuest
{
    protected string $query;

    public function __construct(
        protected string             $data,
        protected int                $roomId,
        protected Connection $dbConnection
    )
    {
        $this->query = "SELECT nickname FROM log WHERE id = (SELECT user_id FROM user_room WHERE data = :data AND room_id = :room_id)";
    }

    public function getDataGuest(): Res|array
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query);
            $stmt->execute([
                "data" => $this->data,
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