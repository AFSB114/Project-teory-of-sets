<?php
include_once '../connection/connection.php';
include_once 'schemas/response.php';
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true); //Devuelve los datos en un array asociativo si esta true

$query = "SELECT log.id, log.nickname, log.email, users.name, users.surname from log inner join users ON users.id = log.id AND log.nickname = :username AND log.password = :password";

class User
{
    public int $id;
    public string $nickname;
    public string $email;
    public string $name;
    public string $surname;

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->nickname = $data['nickname'];
        $this->email = $data['email'];
        $this->name = $data['name'];
        $this->surname = $data['surname'];
    }
}

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':username' => $req['username'],
        ':password' => $req['password']
    ]);
} catch (PDOException $e) {
    $res = new Res("error", "Error en la conexión a la base de datos");
    http_response_code(500);
    echo json_encode($res);
    exit();
}

if ($stmt->rowCount() == 0) {
    $res = new Res("error", "Usuario o contraseña incorrectos");
    http_response_code(400);
} else {
    $data_User = new User($stmt->fetch(PDO::FETCH_ASSOC));
    $res = new Res("success", "Logueado correctamente", $data_User);
    http_response_code(200);
}

echo json_encode($res);
exit();