<?php

use Mailer\MailService;

include_once '../config/mailer.php';

class Email
{
    public function __construct(
        protected User        $user,
        protected MailService $mailer = new MailService(),
        protected DatabaseConnection $pdo = new DatabaseConnection()
    )
    {}

    public function verifyData(): array
    {
        $conn = $this->pdo->connection();

        $query = "SELECT email FROM log WHERE email = :email";
        $res = $conn->prepare($query);
        $res->execute([
            'email'=>$this->user->getEmail()
        ]);

        $email = match ($res->rowCount()) {
            0 => 'available',
            default => 'unavailable',
        };

        $query = "SELECT nickname FROM log WHERE nickname = :nickname";
        $res = $conn->prepare($query);
        $res->execute([
            'nickname'=>$this->user->getNickname()
        ]);

        $nickname = match ($res->rowCount()) {
            0 => 'available',
            default => 'unavailable',
        };

        return ['email'=>$email,'nickname'=>$nickname];
    }

    public function sendVerification(array $data): bool
    {
        $url = 'http://localhost:8000/public/start/?data=' . urlencode($data['data']) . '&token=' . $data['key'];
        $body = '
            <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Correo</title>
    <style>
        /* Estilos en línea para compatibilidad con clientes de correo */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #007bff;
            color: white;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .button {
            all: unset;
            display: inline-block;
            padding: 12px 30px;
            margin: 20px 0;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verifica tu correo electrónico</h1>
        </div>
        
        <div class="content">
            <p>Hola,</p>
            <p>Gracias por registrarte. Para completar tu registro, por favor haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>
            
            <a href="'.$url.'" class="button">Verificar correo electrónico</a>
            
            <p>Si no has creado una cuenta, puedes ignorar este mensaje.</p>
        </div>
        
        <div class="footer">
            <p>Este correo fue enviado por Tu Empresa</p>
            <p>© 2024 Tu Empresa. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
        ';

        $this->mailer->addRecipient($this->user->getEmail(), $this->user->getName());
        $this->mailer->setContent('VENNTURE', $body);
        $res = $this->mailer->send();

        return $res;
    }
}