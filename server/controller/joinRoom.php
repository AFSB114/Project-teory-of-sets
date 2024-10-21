<?php
class JoinRoom
{
    protected string $query1;
    protected string $query2;

    public function __construct(
        protected int                $roomId,
        protected int                $userId,
        protected string             $data,
        protected Connection $pdo = new Connection()
    )
    {
        $this->query1 = "SELECT status_id FROM room WHERE id = :room_id AND status_id = 1";
        $this->query2 = "INSERT INTO user_room (user_id, room_id, rol_id, data) VALUES (:user_id, :room_id, 4, :data)";
    }

    public function checkRoom(): array
    {
        $pdo = $this->pdo->connection();

        try {
            $stmt = $pdo->prepare($this->query1);
            $stmt->execute([
                ':room_id' => $this->roomId
            ]);

            $res = match ($stmt->rowCount()) {
                0 => ['status'=>"ERROR", 'message'=>"Sala no encontrada"],
                default => ['status'=>"OK",'message'=> "Sala disponible"]
            };

        } catch (PDOException $error) {
            $res = ['status'=>"ERROR", 'message'=>"Error de conexión", 'data'=>$error];
        } finally {
            return $res;
        }
    }

    public function joinRoom(): array
    {
        $pdo = $this->pdo->connection();

        try {
            $stmt = $pdo->prepare($this->query2);
            $stmt->execute([
                ':room_id' => $this->roomId,
                ':user_id' => $this->userId,
                ':data' => $this->data
            ]);

            $res = ['status'=>"OK", 'message'=>"Te has unido correctamente a la sala"];

        } catch (PDOException $error) {
            if ($error->getCode() === '23505') {
                $res = ['status'=>"JOINED", 'message'=>"Ya te has unido a la sala en otra sesión",'data'=> $error];
            } else {
                $res = ['status'=> "ERROR",'message'=> "Error de conexión", 'data'=>$error];
            }
        } finally {
            return $res;
        }
    }
}
