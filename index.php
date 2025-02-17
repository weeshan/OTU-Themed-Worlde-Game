<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - OTU Wordle</title>
  <link href="style.css" rel="stylesheet" type="text/css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
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
      </form>
      <p>Don't have an account? <a href="signup.php">Sign Up</a></p>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 OTU Wordle. All rights reserved.</p>
  </footer>
</body>
</html>
