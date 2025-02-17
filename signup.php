<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "otu_wordle";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$message = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $signup_username = $_POST['signup-username'];
    $signup_password = $_POST['signup-password'];

    // Check if the username already exists
    $check_sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $signup_username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username already exists
        $message = "Username already exists. Please choose another one.";
        $messageType = "error";
    } else {
        // Hash the password
        $hashed_password = password_hash($signup_password, PASSWORD_DEFAULT);

        // Insert the new user
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $signup_username, $hashed_password);

        if ($stmt->execute()) {
            $message = "Sign-up successful! You can now log in.";
            $messageType = "success";
        } else {
            $message = "Error: " . $stmt->error;
            $messageType = "error";
        }
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link href="signupStyle.css" rel="stylesheet" type="text/css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <h2>Sign Up for OTU Wordle</h2>
    </header>

    <div class="signup-container">
        <form method="POST" action="signup.php">
            <label for="signup-username">Username:</label>
            <input type="text" id="signup-username" name="signup-username" required>

            <label for="signup-password">Password:</label>
            <input type="password" id="signup-password" name="signup-password" required>

            <button type="submit">Sign Up</button>
        </form>

        <?php if (!empty($message)) { ?>
            <div class="message <?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>
        <?php } ?>

        <p>Already have an account? <a href="login.php">Login</a></p>
    </div>

    <footer>
        <p>&copy; 2024 OTU Wordle. All rights reserved.</p>
    </footer>
</body>
</html>
