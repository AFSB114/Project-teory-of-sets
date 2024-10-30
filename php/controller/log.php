<?php

include_once '../config/mailer.php';
include_once '../config/connection.php';
include_once '../schema/user.php';
include_once '../schema/log.php';
include_once '../schema/security.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");

$req = json_decode(file_get_contents("php://input"), true);

if (isset($req['data']) && isset($req['token'])){
    $security = new Security();

    $req = $security->decryptData($req['data'], $req['token']);
}

$user = new User($req);
$log = new Log($user, new DatabaseConnection());

switch ($req["action"]) {
    case "logUp":

            $res = $log->up();

            if ($res['status'] == 'OK') {
                http_response_code(200);
                echo json_encode(['status' => 'OK', 'message' => $res['message']]);

            } else {
                if ($res['code'] == 23505) {
                    http_response_code(409);
                    if (str_contains($res['message'], "email")) {
                        echo json_encode(['status' => 'ERROR', 'message' => 'Ese email ya se encuentra registrado.']);
                    } else {
                        echo json_encode(['status' => 'ERROR', 'message' => 'Ese nombre de usuario ya se encuentra en uso.']);
                    }
                } else {
                    echo json_encode(['status' => 'ERROR', 'message' => $res['message']]);
                }
            }

        break;

    case "logIn":
        $res = $log->in();

        if ($res['status'] == 'OK') {
            if (!count($res['data']) == 0) {
                session_start();
                $_SESSION['id'] = $res['data']['id'];
                $_SESSION['nickname'] = $res['data']['nickname'];
                $_SESSION['email'] = $res['data']['email'];
                $_SESSION['name'] = $res['data']['name'];
                $_SESSION['surname'] = $res['data']['surname'];

                http_response_code(200);
                echo json_encode(['status' => 'OK', 'message' => 'Usuario autenticado.', 'data' => $res['data']]);
            } else {
                http_response_code(409);
                echo json_encode(['status' => 'ERROR', 'message' => 'Usuario no encontrado.']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'ERROR', 'message' => $res['message']]);
        }
        break;

    case "checkLogIn":
        session_start();

        if (isset($_SESSION['id'])) {
            echo json_encode(['authenticated' => true, 'id' => $_SESSION['id']]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;

    case "getData":
        session_start();

        echo json_encode($_SESSION);
        break;


    case "logOut":
        session_start();
        session_destroy();
        echo json_encode(['status' => 'OK', 'message' => 'Ha cerrado sesión exitosamente']);
        break;

    case "recover":

        break;

    default:
        echo json_encode(['status' => 'ERROR', 'message' => 'Acción no valida', 'accion'=>$req['action']]);
        break;
}


