<?php

session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode(['authenticated' => true, 'user_id' => $_SESSION['user_id']]);
} else {
    echo json_encode(['authenticated' => false]);
}