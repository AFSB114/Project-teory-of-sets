<?php

class DeletePlayer
{
    public function __construct(
        protected $client,
        protected Connection          $dbConnection = new Connection()
    )
    {
    }

    public function leftAdmin(): array
    {
        $pdo = $this->dbConnection->connection();

        try {
            $query = "DELETE FROM room WHERE id = :room_id";

            $stmt = $pdo->prepare($query);
            $stmt->execute([
                'room_id' => $this->client->code
            ]);

            echo "Admin left to room\n";

            return ['status' => 'OK', 'message' => 'El administrador de la sala ha salido', 'action' => 'ADMIN_LEFT', 'id'=>$this->client->id];

        } catch (PDOException $e) {
            return ['status' => 'ERROR', 'message' => $e->getMessage()];
        }
    }

    public function leftGuest(): array
    {
        $pdo = $this->dbConnection->connection();

        try {
            $query = "DELETE FROM user_room WHERE user_id = :user_id";

            $stmt = $pdo->prepare($query);
            $stmt->execute([
                'user_id' => $this->client->id
            ]);

            echo "Guest left to room\n";

            return ['status' => 'OK', 'action' => 'GUEST_LEFT', 'id'=>$this->client->id];
        } catch (PDOException $e) {
            return ['status' => 'ERROR', 'message' => $e->getMessage()];
        }
    }
}