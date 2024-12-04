<?php

class FinishedGame
{
    public function __construct(
        protected string     $code,
        protected Connection $conn = new connection()
    )
    {
    }

    public function exitRoom(): void
    {
        $conn = $this->conn->connection();

        try {
            $query = "DELETE FROM room WHERE id = :code";

            $stmt = $conn->prepare($query);
            $stmt->execute([
                'code' => $this->code
            ]);

            echo "Has been eliminated the room successfully";
        } catch (PDOException $e) {
            echo $e->getMessage();
            exit;
        }
    }
}