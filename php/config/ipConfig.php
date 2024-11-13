<?php
class ServerConfig {
    private static $serverIP = null;
    private static $configFile = __DIR__ . '/ip_config.json';

    public static function getServerIP() {
        // Si ya tenemos la IP en memoria, la retornamos
        if (self::$serverIP !== null) {
            return self::$serverIP;
        }

        // Intentamos cargar la IP desde el archivo de configuración
        if (file_exists(self::$configFile)) {
            $config = json_decode(file_get_contents(self::$configFile), true);
            if (isset($config['server_ip'])) {
                self::$serverIP = $config['server_ip'];
                return self::$serverIP;
            }
        }

        // Si no existe configuración, obtenemos y guardamos la IP actual
        $ip = self::detectServerIP();
        self::setServerIP($ip);
        return self::$serverIP;
    }

    public static function setServerIP($ip) {
        self::$serverIP = $ip;
        // Guardamos la IP en el archivo de configuración
        file_put_contents(self::$configFile, json_encode(['server_ip' => $ip]));
    }

    private static function detectServerIP() {
        // Intentamos obtener la IP del servidor de varias formas
        if (!empty($_SERVER['SERVER_ADDR'])) {
            return $_SERVER['SERVER_ADDR'];
        } elseif (!empty($_SERVER['LOCAL_ADDR'])) {
            return $_SERVER['LOCAL_ADDR'];
        } else {
            // Si los métodos anteriores fallan, obtenemos la IP del sistema
            $socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
            socket_connect($socket, "8.8.8.8", 53);  // Conectamos a DNS de Google
            socket_getsockname($socket, $name); // Obtiene la IP local
            socket_close($socket);
            return $name;
        }
    }
}