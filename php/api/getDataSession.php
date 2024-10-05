<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$req = json_decode(file_get_contents("php://input"), true); //Devuelve los datos en un array asociativo si esta true

session_start();

echo json_encode($_SESSION);