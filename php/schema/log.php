<?php
class Log
{
    public function __construct(
        private User              $user,
        public DatabaseConnection $pdo
    ) {
    }

    public function up(): array
    {
        $conn = $this->pdo->connection();
        try {
            $conn->beginTransaction();

            // Cifrar la contraseña antes de almacenarla
            $this->user->setPassword(password_hash($this->user->getPassword(), PASSWORD_BCRYPT));

            $query = "INSERT INTO log (nickname, email, password, update_date) VALUES (:nickname, :email, :password, NULL)";
            $res = $conn->prepare($query);
            $res->execute([
                "nickname" => $this->user->getNickname(),
                "email" => $this->user->getEmail(),
                "password" => $this->user->getPassword()
            ]);

            $this->user->setId($conn->lastInsertId());

            $query = "INSERT INTO users (id, name, surname, birthday) VALUES (:id, :name, :surname, :birthday)";
            $res = $conn->prepare($query);
            $res->execute([
                "id" => $this->user->getId(),
                "name" => $this->user->getName(),
                "surname" => $this->user->getSurname(),
                "birthday" => $this->user->getBirthday()
            ]);

            $conn->commit();
            
            return ['status' => 'OK', 'message' => 'Registrado correctamente'];
        } catch (PDOException $e) {
            $conn->rollBack();
            return ['status' => 'ERROR', 'message' => 'Error en el registro'];
        }
    }

    public function in(): array
    {
        $conn = $this->pdo->connection();
        try {
            $query = "SELECT log.id, log.nickname, log.email, log.password, users.name, users.surname FROM log INNER JOIN users ON users.id = log.id WHERE log.nickname = :username";
            $res = $conn->prepare($query);
            $res->execute([
                "username" => $this->user->getNickname()
            ]);

            $userData = $res->fetch(PDO::FETCH_ASSOC);

            if ($userData && password_verify($this->user->getPassword(), $userData['password'])) {
                return ['status' => 'OK', 'message' => 'Consulta realizada correctamente', 'data' => $userData];
            } else {
                return ['status' => 'ERROR', 'message' => 'Credenciales inválidas'];
            }
        } catch (PDOException $e) {
            return ['status' => 'ERROR', 'message' => 'Error en la consulta'];
        }
    }
}