<?php

namespace Mailer;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require dirname(__DIR__) . '/vendor/autoload.php';

class MailService
{
    private PHPMailer $mail;
    private array $config;

    public function __construct()
    {
        $this->config = [
            'smtp_debug' => SMTP::DEBUG_OFF,
            'host' => 'smtp.gmail.com',
            'username' => 'vennture412@gmail.com',
            'password' => 'vhhp ncch wlcw opoq',
            'port' => 465,
            'encryption' => PHPMailer::ENCRYPTION_SMTPS
        ];

        $this->initialize();
    }

    private function initialize(): void
    {
        $this->mail = new PHPMailer(true);

        try {
            // Server settings
            $this->mail->SMTPDebug = $this->config['smtp_debug'];
            $this->mail->isSMTP();
            $this->mail->Host = $this->config['host'];
            $this->mail->SMTPAuth = true;
            $this->mail->Username = $this->config['username'];
            $this->mail->Password = $this->config['password'];
            $this->mail->SMTPSecure = $this->config['encryption'];
            $this->mail->Port = $this->config['port'];
            $this->mail->addReplyTo('asuazab14@gmail.com', 'Error');

            $this->mail->setFrom($this->config['username'], 'vennture');
        } catch (Exception $e) {
            throw new Exception("Error initializing mailer: {$e->getMessage()}");
        }
    }

    public function addRecipient(string $email, string $name = '')
    {
        $this->mail->addAddress($email, $name);
        return $this;
    }

    public function setContent(string $subject, string $htmlBody)
    {
        $this->mail->isHTML(true);
        $this->mail->Subject = $subject;
        $this->mail->Body = $htmlBody;
        return $this;
    }

    public function send()
    {
        try {
            $this->mail->send();

            return true;
        } catch (Exception $e) {
            throw new Exception("Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}");
        }
    }

    public function getMailer(): PHPMailer
    {
        return $this->mail;
    }
}
