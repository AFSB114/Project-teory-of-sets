<?php

class LastLevel
{
    public function __construct(
        private int               $idUser,
        public DatabaseConnection $pdo
    )
    {
    }

    public function getLastLevel(): array
    {
        $conn = $this->pdo->connection();

        try {
            $query = "SELECT le.name AS level, st.name AS status  FROM user_level us_le INNER JOIN level le ON le.id = us_le.level_id INNER JOIN status st ON us_le.status_id = st.id WHERE us_le.user_id = :user_id ORDER BY date DESC LIMIT 1;";

            $res = $conn->prepare($query);
            $res->execute([
                'user_id' => $this->idUser
            ]);

            if ($res->rowCount() !== 0) {
                return $res->fetch(PDO::FETCH_ASSOC);
            } else {
                return ['level'=>null, 'status'=>null];
            }
        } catch (PDOException $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

    public function upLevel(string $level): array
    {
        $lyrics = preg_replace('/[^a-zA-Z]/', '', $level);
        $num = (int)(preg_replace('/[^0-9]/', '', $level));
        $num += 1;

        return ['level' => "$lyrics$num"];
    }
}