<?php

class Email
{
    public function __construct(
        protected User $user,
        protected MailService $mailer
    ){}

    public function sendToken()
    {
        $this->mailer->addRecipient($this->user->getEmail(), $this->user->getName());
        $mailService->setContent('TEST', '<h1>Test</h1><br>Esto es una prueba');
        $res = $mailService->send();
    }
}