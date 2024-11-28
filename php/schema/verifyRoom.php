<?php

class VerifyRoom
{
    public function __construct(
        private int $idUser,
        private int $idRoom,
        public DatabaseConnection $pdo
    ){}

    public function alreadyJoined()
    {
        $conn = $this->pdo->connection();

        try {

            $query = "SELECT * FROM user_room WHERE user_id = :user_id";

            $res = $conn->prepare($query);
            $res->execute([
                'user_id' => $this->idUser
            ]);

            return $res->rowCount() === 0;

        } catch (PDOException $e){
            return ['error' => $e->getMessage()];
        }
    }

    public function existRoom(): array
    {
        $conn = $this->pdo->connection();

        try {

            $query = "SELECT COUNT(*) AS exist FROM room WHERE id = :room_id";

            $res = $conn->prepare($query);
            $res->execute([
                'room_id' => $this->idRoom
            ]);

            return $res->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e){
            return ['error' => $e->getMessage()];
        }
    }

    public function countPlayers(): array
    {
        $conn = $this->pdo->connection();

        try {

            $query = "SELECT COUNT(*) AS num_players FROM user_room WHERE room_id = :room_id";

            $res = $conn->prepare($query);
            $res->execute(['room_id' => $this->idRoom]);

            return $res->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e){
            return ['error' => $e->getMessage()];
        }
    }
}