<?php

class DeletePlayer
{
    protected string $query1;
    protected string $query2;

    public function __construct(
        protected string     $sessionId,
        protected int|string        $roomId,
        protected Connection $dbConnection = new Connection()
    )
    {
        $this->query1 = "DELETE FROM user_room ur USING room r WHERE ur.data = :data AND ur.room_id = r.id AND r.id = :room_id";
        $this->query2 = "DELETE FROM room WHERE id = :room_id";
    }

    public function leftAdmin(): Res
    {
        $pdo = $this->dbConnection->connection();

        try {

            $stm = $pdo->prepare($this->query2);
            $stm->execute([
                "room_id" => $this->roomId
            ]);

            $res = new Res('success', 'El admin ha abandonado la sala', $stm);
        } catch (PDOException $error) {
            $res = new Res('error', 'Error de conexión', $error);
        } finally {
            return $res;
        }
    }

    public function leftGuest(): Res
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stm = $pdo->prepare($this->query1);
            $stm->execute([
                "data" => $this->sessionId,
                "room_id" => $this->roomId
            ]);

            $res = new Res('success', 'El guest ha abandonado');
        } catch (PDOException $error) {
            $res = new Res('error', 'Error de conexión', $error);
        } finally {
            return $res;
        }
    }
}