<?php

include_once '../config/connection.php';
include_once '../schema/saveLevels.php';
include_once '../schema/lastLevel.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");

$req = json_decode(file_get_contents("php://input"), true);

session_start();
if (!isset($_SESSION["id"])) {
    echo json_encode(['level'=>null]);
    exit();
} elseif (isset($req['idLevel'])){
    $saveLevels = new SaveLevels($_SESSION['id'], $req['idLevel'], new DatabaseConnection());
}


switch ($req['action']) {
    case 'started':
        $res = $saveLevels->started();
        if (isset($res['code']) && $res['code'] == 23505) {
            $res = ['status' => true, 'message' => 'Ya lo ha iniciado'];
        }
        http_response_code(200);
        echo json_encode($res);
        break;
    case 'completed':
        $res = $saveLevels->finished($req['time']);
        http_response_code(200);
        echo json_encode($res);
        break;
    case 'lastLevel':
        $level = new LastLevel($_SESSION['id'],  new DatabaseConnection());
        $res = $level->getLastLevel();
        if ($res['status'] == 'complete') {
            $res = $level->upLevel($res['level']);
        }
        http_response_code(200);
        echo json_encode(['level'=>$res['level']]);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'invalid action']);
        break;
}