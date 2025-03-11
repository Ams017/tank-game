<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}
// Check if map_id is set in the URL
if (!isset($_GET['map_id'])) {
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

$conn = new mysqli($servername, $username, $password, $dbname);

//check if map belongs to the user
$map_id = $_GET['map_id'];
$user_id = $_SESSION['user_id'];
$mapQuery = $conn->prepare("SELECT * FROM user_maps WHERE map_id = ? AND user_id = ?");
$mapQuery->bind_param("ii", $map_id, $user_id);
$mapQuery->execute();
$mapResult = $mapQuery->get_result();

if ($mapResult->num_rows == 0) {
    header("Location: usermaps.php");
    exit();
}

$map = $mapResult->fetch_assoc();
$mapQuery->close();

// Fetch map data
$mapData = json_decode($map['map_data']);
$mapName = $map['map_name'];

echo "<script>const mapData = " . json_encode($mapData) . ";</script>";

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Tank Shooter</title>
    <style></style>
</head>
<body>
    <canvas id="myCanvas"></canvas>
    <script src="playgame.js"></script>
</body>
</html>