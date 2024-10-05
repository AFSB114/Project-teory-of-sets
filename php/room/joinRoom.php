<?php

class JoinRoom
{
    protected string $query1;
    protected string $query2;

    public function __construct(
        protected int                $roomId,
        protected int                $userId,
        protected string             $data,
        protected DatabaseConnection $dbConnection
    )
    {
        $this->query1 = "SELECT status_id FROM room WHERE id = :room_id AND status_id = 1";
        $this->query2 = "INSERT INTO user_room (user_id, room_id, rol_id, data) VALUES (:user_id, :room_id, 4, :data)";
    }

    public function checkRoom(): Res
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query1);
            $stmt->execute([
                ':room_id' => $this->roomId
            ]);

            $res = match ($stmt->rowCount()) {
                0 => new Res("error", "Sala no encontrada"),
                default => new Res("success", "Sala disponible")
            };
        } catch (PDOException $error) {
            $res = new Res("error", "Error de conexión", $error);
        } finally {
            return $res;
        }
    }

    public function joinRoom(): Res
    {
        $pdo = $this->dbConnection->connection();

        try {
            $stmt = $pdo->prepare($this->query2);
            $stmt->execute([
                ':room_id' => $this->roomId,
                ':user_id' => $this->userId,
                ':data' => $this->data
            ]);

            $res = new Res("success", "Te has unido correctamente a la sala", $this->userId);

        } catch (PDOException $error) {
            if ($error->getCode() === '23505') {
                $res = new Res("join", "Ya te has unido a la sala en otra sesión", $error);
            } else {
                $res = new Res("error", "Error de conexión", $error);
            }
        } finally {
            return $res;
        }
    }
}
