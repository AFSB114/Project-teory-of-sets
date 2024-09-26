<?php
include_once '../connection/connection.php';
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true);//Devuelve los datos en un array asociativo si esta true

class User {
    public string $name;
    public string $surname;
    public string $nickname;
    public string $birthday;
    public string $email;
    public string $password;

    public function __construct($data){
        $this->name = $data['name'];
        $this->surname = $data['surname'];
        $this->nickname = $data['nickname'];
        $this->birthday = $data['birthday'];
        $this->email = $data['email'];
        $this->password = $data['password'];
    }
}

class Res
{
    public function __construct(
        public string $status,
        public string $message,
        public mixed $data = null,
    ) {}
}

$user = new User($req);

$now = new DateTime();
$dateNow = $now->format('Y-m-d');

try {
   $pdo->beginTransaction();

   $query = "INSERT INTO log (nickname, email, password, create_date) VALUES (:nickname, :email, :password, :create_date)";
   $stmt = $pdo->prepare($query);
   $stmt->execute([
       ':nickname' => $user->nickname,
       ':email' => $user->email,
       ':password' => $user->password,
       ':create_date' => $dateNow
   ]);

   $id = $pdo->lastInsertId();
   $query = "INSERT INTO users (id, name, surname, birthday, create_date) VALUES (:id, :name, :surname, :birthday, :create_date)";
   $stmt = $pdo->prepare($query);
   $stmt->execute([
       ':id' => $id,
       ':name' => $user->name,
       ':surname' => $user->surname,
       ':birthday' => $user->birthday,
       ':create_date' => $dateNow
   ]);

   $pdo->commit();

   $res = new Res("success", "Te has registrado correctamente");
   http_response_code(200);
   echo json_encode($res);
} catch (PDOException $e) {

    if ($e->getCode() === '23505') {
        if (strpos($e->getMessage(), 'email') !== false) {
            $res = new Res("error", "El email ya se encuentra vinculado a otra cuenta", 'email');
        } else {
            $res = new Res("error", "El nombre de usuario ya esta en uso", 'username');
        }
        http_response_code(409);
    } else {
        $res = new Res("error", "Error en la conexión a la base de datos", $e);
        http_response_code(500);
    }
    echo json_encode($res);
}