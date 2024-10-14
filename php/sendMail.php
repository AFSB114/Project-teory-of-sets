<?php

require __DIR__ . '/vendor/autoload.php';

$resend = Resend::client('re_BAHekHA7_9QuGzCJ7ndFwTm7Wpb6cz4ZR');

$resend->emails->send([
  'from' => 'VENNTURE <return_password@project-teory-of-sets.vercel.app>',
  'to' => ['asuazab13@gmail.com'],
  'subject' => 'Return Password',
  'html' => '<strong>it works!</strong>',
]);