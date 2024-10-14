<?php

class Log
{
    public function __construct(
        private User              $user,
        public DatabaseConnection $pdo
    )
    {
    }

    protected function dateNow(): string
    {
        $now = new DateTime();
        return $now->format('Y-m-d');
    }

    public function up(): array
    {
        $conn = $this->pdo->connection();

        try {
            $conn->beginTransaction();

            $query = "INSERT INTO log (nickname, email, password, create_date) VALUES (:nickname, :email, :password, :create_date)";
            $res = $conn->prepare($query);
            $res = $res->execute([
                "nickname" => $this->user->getNickname(),
                "email" => $this->user->getEmail(),
                "password" => $this->user->getPassword(),
                "create_date" => $this->dateNow()
            ]);

            $this->user->setId($conn->lastInsertId());

            $query = "INSERT INTO users (id, name, surname, birthday, create_date) VALUES (:id, :name, :surname, :birthday, :create_date)";
            $res = $conn->prepare($query);
            $res = $res->execute([
                "id" => $this->user->getId(),
                "name" => $this->user->getName(),
                "surname" => $this->user->getSurname(),
                "birthday" => $this->user->getBirthday(),
                "create_date" => $this->dateNow()
            ]);

            $conn->commit();

            return ['status' => 'OK', 'message' => 'Registrado correctamente'];
        } catch (PDOException $e) {
            $conn->rollBack();

            return ['status' => 'ERROR', 'message' => $e->getMessage(), 'code' => $e->getCode()];
        }
    }

    public function in(): array
    {
        $conn = $this->pdo->connection();

        try {
            $query = "SELECT log.id, log.nickname, log.email, users.name, users.surname from log inner join users ON users.id = log.id AND log.nickname = :username AND log.password = :password";

            $res = $conn->prepare($query);
            $res->execute([
                "username" => $this->user->getNickname(),
                "password" => $this->user->getPassword()
            ]);

            return ['status' => 'OK', 'message' => 'Consulta realizada correctamente', 'data' => $res->fetch(PDO::FETCH_ASSOC)];
        } catch (PDOException $e) {
            return ['status' => 'ERROR', 'message' => $e->getMessage(), 'code' => $e->getCode()];
        }
    }
}