<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar el autoloader de Composer
require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.resend.com'; // Servidor SMTP
    $mail->SMTPAuth   = true;
    $mail->Username   = 'vennture24@resend.com'; // Tu correo de Gmail
    $mail->Password   = 'Af300407'; // Tu contraseña o contraseña de aplicación
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Destinatarios
    $mail->setFrom('vennture24@hotmail.com', 'Nombre Remitente');
    $mail->addAddress('asuazab14@gmail.com', 'Nombre Destinatario');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Asunto del correo';
    $mail->Body    = 'Este es el cuerpo del correo en HTML.';
    $mail->AltBody = 'Este es el cuerpo del correo en texto plano.';

    $mail->send();
    echo 'Correo enviado con éxito';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
