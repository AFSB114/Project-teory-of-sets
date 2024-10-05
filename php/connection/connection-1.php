<?php
$host = "localhost";
$db = "vennture";
$user = "postgres";
$password = "Af300407";
$port = "5432";

// Crea la cadena de conexión
$dsn = "pgsql:host=$host;port=$port;dbname=$db;";

try {
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    // echo "Conectado a la base de datos PostgreSQL correctamente!";   
} catch (PDOException $err) {
    die("Error de conexión: " . $err->getMessage());
}