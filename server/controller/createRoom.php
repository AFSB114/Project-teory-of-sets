<?php

class Room
{
    private string $code;

    public function __construct(
        protected int        $admin,
        protected int        $time,
        protected int        $numLevels,
        protected Connection $pdo
    )
    {
    }

    private function generateCode(): void
    {
        // Generar el primer dígito (1-9)
        $firstNum = rand(1, 9);

        // Generar los siguientes 5 dígitos (0-9)
        $nextNums = '';
        for ($i = 0; $i < 5; $i++) {
            $nextNums .= rand(0, 9);
        }

        // Concatenar el primer dígito con los siguientes
        $this->code = (int)($firstNum . $nextNums);
    }

    public function createRoom(): array
    {
        $conn = $this->pdo->connection();

        $while = true;

        do {

            try {
                $conn->beginTransaction();

                $this->generateCode();

                $query = "INSERT INTO room (id, max_time, nums_levels, status_id) VALUES (:id, :max_time, :num_levels, 1)";
                $res = $conn->prepare($query);
                $res->execute([
                    "id" => $this->code,
                    "max_time" => $this->time,
                    "num_levels" => $this->numLevels
                ]);

                $query = "INSERT INTO user_room (user_id, room_id, rol_id) VALUES (:user_id, :room_id, 3)";
                $res = $conn->prepare($query);
                $res->execute([
                    "user_id" => $this->admin,
                    "room_id" => $this->code,
                ]);

                $conn->commit();


                $while = false;
            } catch (PDOException $e) {
                $conn->rollBack();
                if (!$e->getCode() == "23505") {
                    return ["message", "Error al crear sala", 'data' => $e];
                    echo json_encode($e);
                    $while = false;
                }
                echo "Hubo un error al crear sala: " . $e->getMessage();
            }
        } while ($while);

        return ['code' => $this->code];
    }

    private function insertLevels(array $level, int $code): void
    {
        $conn = $this->pdo->connection();

        $query = "INSERT INTO level_room (level_id, room_id) VALUES (:level_id, :room_id)";

        $res = $conn->prepare($query);
        $res->execute([
            "level_id" => $level['id'],
            "room_id" => $code
        ]);
    }

    public function levelsToRoom(int $code): array
    {
        $conn = $this->pdo->connection();

        try {

            $query = "SELECT id, name FROM level WHERE id <= 7 ORDER BY RANDOM() LIMIT {$this->numLevels}";

            $res = $conn->prepare($query);
            $res->execute();

            $levels = $res->fetchAll(PDO::FETCH_ASSOC);

            try {
                $conn->beginTransaction();
                foreach ($levels as $level) {
                    $this->insertLevels($level, $code);
                }
                $conn->commit();
            } catch (PDOException $e) {
                $conn->rollBack();
                echo "{$e->getMessage()}\n";
                return ["message", "Error al crear sala", 'data' => $e];
            }

            return $levels;

        } catch (PDOException $e) {
            echo "{$e->getMessage()}\n";
            return ["message", "Error al crear sala", 'data' => $e];
        }
    }
}