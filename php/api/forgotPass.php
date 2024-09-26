<?php
include_once '../connection/connection.php';
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true);//Devuelve los datos en un array asociativo si esta true

$query = "SELECT id,nickname,email FROM log WHERE email = :email";

class Res
{
    public function __construct(
        public string $status,
        public string $message,
        public mixed $data = null,
    ) {}
}

class User {
    public int $id;
    public string $nickname;
    public string $email;

    public function __construct($data){
        $this->id = $data['id'];
        $this->nickname = $data['nickname'];
        $this->email = $data['email'];
    }
}

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':email' => $req['email']
    ]);
} catch (PDOException $e) {
    $res = new Res("error", "Error en la conexión a la base de datos");
    http_response_code(500);
    echo json_encode($res);
    exit();
}


if ($stmt->rowCount() === 1) {
    $data_User = new User($stmt->fetch(PDO::FETCH_ASSOC));
    $res = new Res("success", "Email enviado",$data_User);
    http_response_code(200);
    echo json_encode($res);
    exit();
} else {
    $res = new Res("error", "Email no encontrado");
    http_response_code(404);
    echo json_encode($res);
    exit();
}