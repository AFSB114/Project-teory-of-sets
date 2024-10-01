<?php
include_once '../connection/connection.php';
global $pdo;
include_once 'schemas/response.php';
include_once 'schemas/user.php';
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true); //Devuelve los datos en un array asociativo si esta true

$query = "INSERT INTO room (id, max_time, nums_levels, status_id) VALUES (:id, :max_time, :num_levels, :status_id)";

function generateCode()
{
    $caracteres = '123456789'; // Solo números
    $patron = '/^[0-9]{3}-[0-9]{3}$/'; // Patrón para validar que sea 3 números, un guion, y otros 3 números
    do {
        $shuffled = str_shuffle($caracteres);
        $codigo = substr($shuffled, 0, 3) . '-' . substr($shuffled, 3, 3);
    } while (!preg_match($patron, $codigo));
    return $codigo;
}

$while = true;

do {
    try {
        $code = generateCode();
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':id' => str_replace('-', '', $code),
            ':max_time' => $req['time'],
            ':num_levels' => $req['numLevels'],
            ':status_id' => $req['difficulty']
        ]);
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
