<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Tank Shooter</title>
    <style></style>
</head>
<body>
    <canvas id="mapc"></canvas>
    
    <form method="POST" action="savemap.php">
        <!-- map name-->
        <label for="map-name">Map Name:</label>
        <input type="text" id="map-name" name="map_name" required><br><br>
        <!-- hidden user id -->
        <input type="hidden" id="user-id" name="user_id" value="<?php echo $_SESSION['user_id']; ?>">
        <!-- hidden map data -->
        <input type="hidden" id="map-data" name="map_data" required>
        <input type="submit" value="Submit" id="submit">
    </form>
    <script src="createmap.js"></script>
</body>
</html>
