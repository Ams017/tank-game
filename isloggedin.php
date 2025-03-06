<?php
session_start();
$response = ['loggedIn' => isset($_SESSION['username'])];
echo json_encode($response);
?>
