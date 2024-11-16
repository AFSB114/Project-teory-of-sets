<?php
include_once '../config/connection.php';
global $pdo;
include_once './response.php';
include_once './user.php';
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$req = json_decode(file_get_contents("php://input"), true);

$character_id = $req['character_id'];

$connection = new DatabaseConnection();
$pdo = $connection->connection();

session_start();
$user_id = $_SESSION['id'];

// Actualiza el personaje en la base de datos
$query = "UPDATE users SET character_id = :character_id WHERE id = :user_id";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':character_id' => $character_id,
        ':user_id' => $user_id
    ]);

    // Devuelve una respuesta exitosa
    $res = ['status'=>"success", 'message'=>"Personaje seleccionado correctamente"];
    http_response_code(200);

} catch (Exception $e) {
    // Si ocurre un error, devuelve una respuesta de error
    $res = ['status'=>"error", 'message'=>$e->getMessage()];
    http_response_code(400);
    
}
echo json_encode($res);
exit();