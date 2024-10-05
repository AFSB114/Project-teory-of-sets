<?php

class createRoom
{
    protected string $query1;
    protected string $query2;
    protected string $roomId;

    public function __construct
    (
        protected int                $userId,
        protected int                $maxTime,
        protected int                $numLevels,
        protected string             $data,
        protected DatabaseConnection $dbConnection
    )
    {
        $this->query1 = "INSERT INTO room (id, max_time, nums_levels, status_id) VALUES (:id, :max_time, :num_levels, 1)";
        $this->query2 = "INSERT INTO user_room (user_id, room_id, rol_id, data) VALUES (:user_id, :room_id, 3, :data)";
    }

    public function createRoom(): Res
    {
        $pdo = $this->dbConnection->connection();

        $while = true;

        do {

            $this->roomId = $this->generateCode();

            try {

                $pdo->beginTransaction();

                $stmt = $pdo->prepare($this->query1);
                $stmt->execute([
                    ':id' => $this->roomId,
                    ':max_time' => $this->maxTime,
                    ':num_levels' => $this->numLevels,
                ]);

                $stmt = $pdo->prepare($this->query2);
                $stmt->execute([
                    ':user_id' => $this->userId,
                    ':room_id' => $this->roomId,
                    ':data' => $this->data,
                ]);

                $pdo->commit();

                $res = new Res("success", "Sala creada", $this->roomId);

                $while = false;

            } catch (PDOException $error) {
                if (!$error->getCode() == "23505") {
                    $res = new Res("error", "Error al crear sala", $error);
                    $while = false;
                    echo $res->data;
                }
            }
        } while ($while);

        return $res;
    }

    protected function generateCode(): int
    {
        $code = rand(1, 9);
        $code = strval($code);

        for ($i = 0; $i < 5; $i++) {
            $code .= rand(0, 9);
        }

        return $code;
    }
}