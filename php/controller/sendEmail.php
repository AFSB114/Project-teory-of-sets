<?php
include_once '../config/connection.php';
include_once '../schema/user.php';
include_once '../schema/email.php';
include_once '../schema/security.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");

$req = json_decode(file_get_contents("php://input"), true);

$user = new User($req);

$mailService = new email($user);

$verify = $mailService->verifyData();

if ($verify['email']=== 'available' && $verify['nickname'] === 'available') {
    $security = new Security();
    $encrypt = $security->encryptData($req);
    try {

        $res = $mailService->sendVerification($encrypt);

        echo json_encode(['status' => 'OK']);

    } catch (Exception $e) {
        echo json_encode(['status' => 'ERROR', 'message' => $e->getMessage()]);
    }
} elseif ($verify['email'] === 'unavailable' && $verify['nickname'] === 'unavailable') {
    echo json_encode(['status' => 'ERROR', 'message' => 'La dirección de correo y el nombre de usuario ya se encuentran en uso']);
} elseif ($verify['email'] === 'available' && $verify['nickname'] === 'unavailable') {
    echo json_encode(['status' => 'ERROR', 'message' => 'El nombre de usuario ya se encuentra en uso']);
} else {
    echo json_encode(['status' => 'ERROR', 'message' => 'La dirección de correo ya se encuentra en uso']);
}





