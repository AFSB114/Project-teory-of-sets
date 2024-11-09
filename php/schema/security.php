<?php

class Security
{
    private function generateToken(): string
    {
        return bin2hex(random_bytes(10));
    }

    public function generateTokenTemporary(int $expireMinutes = 30) {
        // Genera un string aleatorio usando caracteres seguros
        $randomBytes = bin2hex(random_bytes(32));

        // Obtiene el timestamp actual y de expiración
        $currentTime = time();
        $expirationTime = $currentTime + ($expireMinutes * 60);

        // Combina los datos para crear el token
        $tokenData = [
            'random' => $randomBytes,
            'timestamp' => $currentTime,
            'expiration' => $expirationTime
        ];

        // Codifica el token en base64 para hacerlo más corto y manejable
        $token = base64_encode(json_encode($tokenData));

        return [
            'token' => $token,
            'expires_at' => date('Y-m-d H:i:s', $expirationTime)
        ];
    }

    public function verifyToken($token) {
        try {
            // Decodifica el token
            $tokenData = json_decode(base64_decode($token), true);

            // Verifica que el token tenga la estructura correcta
            if (!isset($tokenData['expiration'])) {
                return false;
            }

            // Verifica si el token ha expirado
            return time() <= $tokenData['expiration'];

        } catch (Exception $e) {
            return false;
        }
    }
    public function encryptData(array $data): array
    {
        $method = 'AES-256-CBC';
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($method));

        // Convertir el array a JSON
        $jsonDatos = json_encode($data);

        $key = $this->generateToken();

        // Cifrar los datos JSON
        $dataEncrypted = openssl_encrypt($jsonDatos, $method, $key, 0, $iv);

        // Codificar en base64 y concatenar el IV
        return ['data'=>base64_encode($dataEncrypted . '::' . $iv), 'key'=>$key];
    }

    public function decryptData(string $data, string $key): array
    {
        $method = 'AES-256-CBC';

        // Decodificar base64
        list($dataEncrypted, $iv) = explode('::', base64_decode($data), 2);

        // Desencriptar los datos JSON
        $jsonData = openssl_decrypt($dataEncrypted, $method, $key, 0, $iv);

        // Convertir el JSON a un array
        return json_decode($jsonData, true);
    }
}