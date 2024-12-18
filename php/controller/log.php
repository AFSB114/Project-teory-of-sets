<?php

include_once '../config/mailer.php';
include_once '../config/connection.php';
include_once '../schema/user.php';
include_once '../schema/log.php';
include_once '../schema/security.php';
include_once '../schema/resetPass.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");

$req = json_decode(file_get_contents("php://input"), true);


if (isset($req['data']) && isset($req['key'])) {
    if (isset($req['token'])) {
        $token = $req['token'];
        $password = $req['password'];
    }
    $security = new Security();


    $req = $security->decryptData($req['data'], $req['key']);
    if (isset($password)) {
        $req['password'] = $password;
    }
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
            echo json_encode(['status' => 'ERROR', 'message' => $res['message'], 'error' => $res['error']]);

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
                $_SESSION['see_int_mlt'] = $res['data']['see_int_mlt'];

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
            echo json_encode(['authenticated' => true, 'see_int_mlt' => $_SESSION['see_int_mlt']]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;

    case "getData":
        session_start();

        echo json_encode($_SESSION);
        break;

    case "see_int_mlt":
        session_start();

        $res = $log->see_int_mlt($_SESSION['id']);

        if ($res['status'] == 'OK') {
            $_SESSION['see_int_mlt'] = true;
        }

        echo json_encode($res);
        break;

    case "logOut":
        session_start();
        session_destroy();
        echo json_encode(['status' => 'OK', 'message' => 'Ha cerrado sesión exitosamente']);
        break;

    case "forgotPass":
        $reset = new ResetPass($user, new DatabaseConnection());
        if ($security->verifyToken($token)) {
            $res = $reset->change();

            if ($res['status'] == 'OK') {
                http_response_code(200);
                echo json_encode(['status' => 'OK', 'message' => $res['message']]);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'ERROR', 'message' => $res['message']]);
            }
        } else {
            http_response_code(401);
            echo json_encode(['status' => 'ERROR', 'message' => 'Token invalido']);
        }

        break;

    default:
        echo json_encode(['status' => 'ERROR', 'message' => 'Acción no valida', 'action' => $req['action']]);
        break;
}


