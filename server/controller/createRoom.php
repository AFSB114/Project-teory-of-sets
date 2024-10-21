<?php
class Room
{
    private string $code;

    public function __construct(
        protected int        $admin,
        protected int        $time,
        protected int        $numLevels,
        protected string     $data,
        protected Connection $pdo
    )
    { }

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
        $this->code= (int)($firstNum . $nextNums);
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

                $query = "INSERT INTO user_room (user_id, room_id, rol_id, data) VALUES (:user_id, :room_id, 3, :data)";
                $res = $conn->prepare($query);
                $res->execute([
                    "user_id" => $this->admin,
                    "room_id" => $this->code,
                    "data" => $this->data
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
            }
        } while ($while);

        return ['code' => $this->code];
    }
}