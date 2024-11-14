<?php
class SaveLevels
{
    public function __construct(
        private int $idUser,
        private int $idLevel,
        public DatabaseConnection $pdo
    )
    {}

    public function started(): array
    {
        $conn = $this->pdo->connection();

        try {
            $query = "INSERT INTO user_level (user_id, level_id, status_id) VALUES(:user_id, :level_id, 2)";

            $result = $conn->prepare($query);
            $result->execute([
                ':user_id' => $this->idUser,
                ':level_id' => $this->idLevel
            ]);
            return ['status'=>true];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => $e->getMessage(), 'code' => $e->getCode()];
        }
    }

    public function finished(string $time): array
    {
        $conn = $this->pdo->connection();

        try{
            $query = "UPDATE user_level SET status_id = 1, time = :time WHERE user_id = :user_id AND level_id = :level_id";

            $result = $conn->prepare($query);
            $result->execute([
                ':time' => $time,
                ':user_id' => $this->idUser,
                ':level_id' => $this->idLevel
            ]);
            return ['status'=>true];
        }catch (PDOException $e){
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
}