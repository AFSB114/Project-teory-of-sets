<?php

session_start();
setcookie('session_token', '', time() - 3600, '/');
session_destroy();
echo json_encode(['status' => 'success']);