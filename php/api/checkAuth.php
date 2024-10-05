<?php

session_start();

if (isset($_SESSION['id'])) {
    echo json_encode(['authenticated' => true, 'id' => $_SESSION['id']]);
} else {
    echo json_encode(['authenticated' => false]);
}