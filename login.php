<?php
session_start();

include('db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $user['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = "Invalid username or password.";
        }
    } else {
        $error = "Invalid username or password.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - OTU Wordle</title>
  <link href="style.css" rel="stylesheet" type="text/css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <h2>Welcome to OTU Wordle</h2>
  </header>
  <div class="login-container">
    <div id="login-form" class="auth-form">
      <h2>Sign In</h2>
      <form action="login.php" method="POST">
        <label for="login-username">Username:</label>
        <input type="text" id="login-username" name="username" placeholder="Enter your username" required>
        
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" name="password" placeholder="Enter your password" required>

        <button type="submit">LOGIN</button>
        
        <div id="error-message" class="error-message"></div>
      </form>
      <p>Don't have an account? <a href="signup.php">Sign Up</a></p>
    </div>
  </div>

  <?php if (isset($error)) { ?>
    <script>
      document.getElementById("error-message").style.display = "block";
      document.getElementById("error-message").textContent = "<?php echo $error; ?>";
    </script>
  <?php } ?>

  <footer>
    <p>&copy; 2024 OTU Wordle. All rights reserved.</p>
  </footer>
</body>
</html>