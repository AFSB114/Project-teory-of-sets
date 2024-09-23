<?php
$host = "localhost";
$db = "vennture";
$user = "postgres";
$password = "Af300407";
$port = "5432"; // Puerto por defecto de PostgreSQL

// Crear la cadena de conexión
$dsn = "pgsql:host=$host;port=$port;dbname=$db;";

try {
    // Crear una nueva instancia de PDO
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    // echo "Conectado a la base de datos PostgreSQL correctamente!";   
} catch (PDOException $err) {
    // En caso de error, capturamos la excepción
    die("Error de conexión: " . $err->getMessage());
}


