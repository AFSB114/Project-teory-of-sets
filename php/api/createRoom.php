<?php
include_once '../connection/connection.php';
global $pdo;
include_once 'schemas/response.php';
include_once 'schemas/user.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true); //Devuelve los datos en un array asociativo si esta true


function generateCode() : string
{
    $caracteres = '123456789'; // Solo números
    $patron = '/^[0-9]{3}-[0-9]{3}$/'; // Patrón para validar que sea 3 números, un guion, y otros 3 números
    do {
        $shuffled = str_shuffle($caracteres);
        $code = substr($shuffled, 0, 3) . '-' . substr($shuffled, 3, 3);
    } while (!preg_match($patron, $code));
    return $code;
}

$while = true;

session_start();
do {
    try {
        $pdo->beginTransaction();
        
        $query = "INSERT INTO room (id, max_time, nums_levels, status_id) VALUES (:id, :max_time, :num_levels, 1)";
        $code = generateCode();

        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':id' => str_replace('-', '', $code),
            ':max_time' => $req['time'],
            ':num_levels' => $req['numLevels']
        ]);

        $query = "INSERT INTO user_room (user_id, room_id, rol_id) VALUES (:user_id, :room_id, 3)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_id' => $_SESSION['id'],
            ':room_id' => str_replace('-', '', $code)
        ]);
        
        $pdo->commit();

        $res = new Res("success", "Sala creada", $code);
        http_response_code(200);

        $while = false;

    } catch (PDOException $e) {
        if (!$e->getCode() == "23505") {
            $res = new Res("error", "Error al crear sala", $e);
            http_response_code(400);
            $while = false;
        }
    }
} while ($while);

echo json_encode($res);
exit();
