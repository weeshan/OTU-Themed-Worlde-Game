function toggleForms(formType) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (formType === 'signup') {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  } else if (formType === 'login') {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
}

function handleSignUp(event) {
  event.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  if (username && password) {
    localStorage.setItem(username, password);
    alert('Sign-Up successful!! Please log in now.');
    toggleForms('login');
  } else {
    alert('Please fill in all the fields.');
  }
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const storedPassword = localStorage.getItem(username);

  if (storedPassword === password) {
    alert('Login successful!');

    window.location.href = "menu.html";

  } else {
    document.getElementById('error-message').style.display = 'block';
  }
}

function goToMenu() {
  window.location.href = 'menu.html';
}

document.getElementById("classic").addEventListener("click", function() {
  window.location.href = "classic-game.html";
});

document.getElementById("blitz").addEventListener("click", function() {
  window.location.href = "blitz-game.html";
});

document.getElementById("hardcore").addEventListener("click", function() {
  window.location.href = "hardcore.html";
});