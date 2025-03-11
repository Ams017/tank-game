<?php
session_start();
var_dump($_POST);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['map_name'], $_POST['user_id'], $_POST['map_data'])) {
        $map_name = $_POST['map_name'];
        $user_id = $_POST['user_id'];
        $map_data = $_POST['map_data'];
        var_dump($map_data);

        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "user_auth";
        
        $conn = new mysqli($servername, $username, $password, $dbname);
        
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Check if map_name and user_id exist in the database
        $stmt = $conn->prepare("SELECT * FROM user_maps WHERE map_name = ? AND user_id = ?");
        $stmt->bind_param("si", $map_name, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Insert new map data
        //$stmt = $conn->prepare("INSERT INTO user_maps (user_id, map_name, map_data) VALUES (?, ?, ?)");
        //update map data
        $stmt = $conn->prepare("UPDATE user_maps SET map_data = ? WHERE user_id = ? AND map_name = ?");
        $stmt->bind_param("sis", $map_data, $user_id, $map_name);
        if ($stmt->execute()) {
            echo "New map saved successfully.";
        } else {
            echo "Error: " . $stmt->error;
        }
        

        $stmt->close();
        $conn->close();
    } else {
        echo "Required data not provided.";
    }
}
?>