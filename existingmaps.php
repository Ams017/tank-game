<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.html");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the logged-in user's ID
$username = $_SESSION['username'];
$userQuery = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$userQuery->bind_param("s", $username);
$userQuery->execute();
$userResult = $userQuery->get_result();
$user = $userResult->fetch_assoc();
$userId = $user['user_id'];

// Fetch maps for the logged-in user
$mapQuery = $conn->prepare("SELECT * FROM user_maps WHERE user_id = ?");
$mapQuery->bind_param("i", $userId);
$mapQuery->execute();
$mapResult = $mapQuery->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Maps</title>
</head>
<body>
    <h1>Edit Maps</h1>
    <ul>
        <?php while ($map = $mapResult->fetch_assoc()): ?>
            <li>
                <a href="editmaps.php?map_id=<?= $map['map_id'] ?>"><?= htmlspecialchars($map['map_name']) ?></a>
            </li>
        <?php endwhile; ?>
    </ul>
</body>
</html>

<?php
$userQuery->close();
$mapQuery->close();
$conn->close();
?>
