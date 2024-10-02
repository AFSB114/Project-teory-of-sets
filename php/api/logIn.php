<?php
include_once '../connection/connection.php';
global $pdo;
include_once 'schemas/response.php';
include_once 'schemas/user.php';
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$req = json_decode(file_get_contents("php://input"), true); //Devuelve los datos en un array asociativo si esta true

$query = "SELECT log.id, log.nickname, log.email, users.name, users.surname from log inner join users ON users.id = log.id AND log.nickname = :username AND log.password = :password";


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
    session_start();
    $data_User = new User($stmt->fetch(PDO::FETCH_ASSOC));

    $_SESSION['user_id'] = $data_User->id;

    setcookie('session_token', $data_User->id, [
        'expires' => time() + (86400 * 30),
        'path' => '/',
        'secure' => true,
        'samesite' => 'strict'
    ]);
    
    $res = new Res("success", "Logueado correctamente", $data_User);
    http_response_code(200);
}

echo json_encode($res);
exit();