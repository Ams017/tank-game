<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}
// Check if map_id is set in the URL
if (!isset($_GET['map_id'])) {
    header("Location: usermaps.php");
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
    <?php echo "<h1>Edit Map: $mapName</h1>"; ?>
    <canvas id="mapc"></canvas>
    <form method="POST" action="saveeditedmap.php">
        <!-- map name-->
        <label for="map-name">Map Name:</label>
        <input type="text" id="map-name" name="map_name" required><br><br>
        <!-- hidden user id -->
        <input type="hidden" id="user-id" name="user_id" value="<?php echo $_SESSION['user_id']; ?>">
        <!-- hidden map data -->
        <input type="hidden" id="map-data" name="map_data" required>
        <input type="submit" value="Submit" id="submit">
    </form>
    <script src="editmap.js"></script>
</body>
</html>