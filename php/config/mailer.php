<?php

namespace email;
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

class sendEmail {
    /**
     * @throws Exception
     */
    public function __construct(
        protected PHPMailer $mail = new PHPMailer()
    ){
        //SERVER SETTINGS
        $this->mail->SMTPDebug = SMTP::DEBUG_OFF;
        $this->mail->isSMTP();
        $this->mail->Host = 'smtp.gmail.com';
        $this->mail->SMTPAuth = true;
        $this->mail->Username = 'vennture412@gmail.com';
        $this->mail->Password = 'vhhp ncch wlcw opoq';
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $this->mail->Port = 587;

        //FROM
        $this->mail->setFrom('vennture412@gmail.com', 'VENNTURE');

        //CONTENT SETTINGS
        $this->mail->CharSet = 'UTF-8';
        $this->mail->setLanguage('es');
        $this->mail->isHTML(true);
    }

    public function sendVerication($to)
    {
        $this->mail->addAddress($to);

        $this->mail->Subject = 'Verificacion de cuenta';
        $this->mail->Body = 'Este email tendra un link para verificar el correo';

        return $this->mail->send();
    }
}

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host = 'smtp.gmail.com';                             //Set the SMTP server to send through
    $mail->SMTPAuth = true;                                     //Enable SMTP authentication
    $mail->Username = 'vennture412@gmail.com';                  //SMTP username
    $mail->Password = 'vhhp ncch wlcw opoq';                    //SMTP password vhhp ncch wlcw opoq
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;             //Enable implicit TLS encryption
    $mail->Port = 465;                                          //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->addAddress('asuazab13@gmail.com', 'Andres');       //Add a recipient
//    $mail->addAddress('ellen@example.com');                               //Name is optional
//    $mail->addReplyTo('info@example.com', 'Information');
//    $mail->addCC('cc@example.com');
//    $mail->addBCC('bcc@example.com');

    //Attachments
//    $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
//    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body = 'This is the HTML message body <b>in bold!</b>';


    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    
    echo "Message could not be sent. Mailer Error: $mail->ErrorInfo";
}
