<?php
session_start();
?>
<nav>
    <ul>
        <?php if (!isset($_SESSION['username'])): ?>
            <li><a href="home.php">Home</a></li>
            <li><a href="register.html">Sign Up</a></li>
            <li><a href="login.php">Log In</a></li>
            <li><a href="playasguest.php">Play as Guest</a></li>
        <?php else: ?>
            <li><a href="home.php">Home</a></li>
            <li><a href="tanky.html">Play Game</a></li>
            <li><a href="account.php">Your Account</a></li>
            <li><a href="usermaps.php">Maps</a></li>
            <li><a href="leaderboard.php">Leaderboard</a></li>
            <li><a href="logout.php">Sign Out</a></li>
        <?php endif; ?>
    </ul>
</nav>
