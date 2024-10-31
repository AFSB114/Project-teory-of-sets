<?php
include_once '../config/connection.php';
global $pdo;
include_once './response.php';
include_once './user.php';
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

session_start();
$user_id = $_SESSION['user_id'];

// Consulta para obtener el personaje seleccionado y el sprite del personaje
$query = "SELECT c.id, c.profileurl, c.spritesurl
          FROM users u
          JOIN character c ON u.character_id = c.id
          WHERE u.id = :user_id";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute([':user_id' => $user_id]);

    $character = $stmt->fetch(PDO::FETCH_ASSOC);

    // Devuelve los datos del personaje
    $res = new Res("success", "Personaje encontrado", $character);
    http_response_code(200);
} catch (Exception $e) {
    $res = new Res("error", $e->getMessage());
    http_response_code(400);
}
echo json_encode($res);
exit();