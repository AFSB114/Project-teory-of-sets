<?php

include_once '../config/connection.php';
include_once '../schema/verifyRoom.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");

$req = json_decode(file_get_contents("php://input"), true);

session_start();
$verifyRoom = new verifyRoom($_SESSION['id'], $req['code'], new DatabaseConnection());


$resExistRoom = $verifyRoom->existRoom();
if ($resExistRoom['exist'] === 1) {
    $resAlreadyJoined = $verifyRoom->alreadyJoined();
    if ($resAlreadyJoined) {
        $resCountPlayers = $verifyRoom->countPlayers();
        if ($resCountPlayers['num_players'] < 8) {
            echo json_encode(['status' => true]);
        } elseif ($resCountPlayers['error']) {
            echo json_encode(['message' => $resCountPlayers['error']]);
        } else {
            echo json_encode(['status' => false, 'message' => 'La sala se encuentra llena']);
        }
    } elseif (isset($resAlreadyJoined['error'])) {
        echo json_encode(['message' => $resAlreadyJoined['error']]);
    } else {
        echo json_encode(['status' => false, 'message' => 'Ya te encuentras unido a una sala en otro lugar']);
    }
} else {
    echo json_encode(['status' => false, 'message' => 'La sala no existe']);
}

