<?php

class ResetPass {
    public function __construct(
        private User              $user,
        public DatabaseConnection $pdo
    ) {}

    public function change() {
        $conn = $this->pdo->connection();
        try {
            $this->user->setPassword(password_hash($this->user->getPassword(), PASSWORD_BCRYPT));

            $query = "UPDATE log SET password = :password WHERE email = :email";
            $res = $conn->prepare($query);
            $res->execute([
                "email" => $this->user->getEmail(),
                "password" => $this->user->getPassword()
            ]);

            return ['status' => 'OK', 'message' => 'Cambio de contraseña exitoso'];
        }catch (PDOException $e) {
            return ['status' => 'ERROR', 'message' => $e->getMessage()];
        }
    }
}