<?php

class Securiy
{
    private function generateToken(): string
    {
        return bin2hex(random_bytes(10));
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

    public function decryptData(string $data, string $key): string
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