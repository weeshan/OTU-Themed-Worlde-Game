function goToMenu() {
  window.location.href = 'menu.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const messageDiv = document.querySelector('.message');
  const goAgainBtn = document.querySelector('.go-again-btn');
  const enterBtn = document.querySelector('.enter');
  const backspaceBtn = document.querySelector('.bksp');
  const infoButton = document.getElementById('info-btn'); // for "How to Play" instructions
  const modal = document.getElementById('how-to-play-modal');
  const closeModal = modal.querySelector('.close'); // close button for the modal
  const menuButton = document.querySelector('.menu-btn');
  menuButton.disabled = false;

  const timerElement = document.getElementById('timer');
  const startGameBtn = document.getElementById('start-game-btn');

  const wordBankBlitz = [
    'tech', 'blue', 'quiz', 'code', 'grad', 'cool', 'page', 'time', 'math', 'chem',
    'book', 'club', 'idea', 'part', 'seat', 'file', 'form', 'labs'
  ]; // 4-letter words for Blitz mode

  let correctWord = '';
  let currentRow = 0;
  let timerDuration = 60; // Default timer duration
  let timerInterval = null;
  let GameStarted = false;

  const rows = document.querySelectorAll('.row');

  // Disable input fields initially
  document.querySelectorAll('.cell').forEach(cell => {
    cell.disabled = true;
  });

  document.querySelectorAll('.key').forEach(key => {
    key.disabled = true;
  });

  function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordBankBlitz.length);
    return wordBankBlitz[randomIndex];
  }

  function initializeGame() {
    // Only initialize the game if it has not already started
    if (GameStarted) {
      return;
    }
  
    correctWord = selectRandomWord().toUpperCase();
    currentRow = 0;
  
    // Reset grid and enable inputs
    document.querySelectorAll('.cell').forEach(cell => {
      cell.value = '';
      cell.style.backgroundColor = '';
      cell.style.color = '';
      cell.disabled = false;  // Enable input when game starts
    });
  
    startTimer(timerDuration);
    messageDiv.textContent = '';
    enterBtn.disabled = false;
  }

  function startTimer(seconds) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    timerElement.textContent = timeLeft;
  
    timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        messageDiv.textContent = `Time's up! The word was: ${correctWord}`;
        enterBtn.disabled = true;
        GameStarted = false; // Game over, reset flag
  
        // Re-enable the timer options when time runs out
        document.querySelectorAll('input[name="timer"]').forEach(radio => {
          radio.disabled = false;
        });
      }
    }, 1000);
  }

  startGameBtn.addEventListener('click', () => {
    // Prevent resetting the game if it has already started
    if (GameStarted) {
      return;
    }
  
    const selectedTimer = document.querySelector('input[name="timer"]:checked').value;
    timerDuration = parseInt(selectedTimer, 10);
    initializeGame();
  
    // Set game as started
    GameStarted = true;
    
    // Disable timer options to prevent switching
    document.querySelectorAll('input[name="timer"]').forEach(radio => {
      radio.disabled = true;
    });
  
    // Enable keyboard buttons when game starts
    document.querySelectorAll('.key').forEach(key => {
      key.disabled = false;
    });
  });

  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
      const currentCells = rows[currentRow].querySelectorAll('.cell');
      for (let i = 0; i < currentCells.length; i++) {
        if (currentCells[i].value === '') {
          currentCells[i].value = key.textContent.toUpperCase();
          break;
        }
      }
    });
  });

  enterBtn.addEventListener('click', submitCurrentRow);

  backspaceBtn.addEventListener('click', () => {
    const currentCells = rows[currentRow].querySelectorAll('.cell');
    for (let i = currentCells.length - 1; i >= 0; i--) {
      if (currentCells[i].value !== '') {
        currentCells[i].value = '';
        break;
      }
    }
  });

  goAgainBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    initializeGame();
  });

  function submitCurrentRow() {
    const currentCells = rows[currentRow].querySelectorAll('.cell');
    const guess = Array.from(currentCells).map(cell => cell.value).join('');
  
    if (guess.length < 4) {
      messageDiv.textContent = "Please enter a 4-letter word.";
      return;
    }
  
    const feedback = getFeedback(guess);
    displayFeedback(feedback);
  
    if (guess === correctWord) {
      messageDiv.textContent = `Congratulations! You've guessed the word.`;
      clearInterval(timerInterval); // Stop the timer immediately if guessed correctly
      enterBtn.disabled = true;
      GameStarted = false; // Game is over, reset flag
    } else {
      currentRow++;
      if (currentRow === rows.length) { // If out of guesses
        messageDiv.textContent = `Game Over! The word was: ${correctWord}`;
        clearInterval(timerInterval); // Stop the timer when guesses run out
        enterBtn.disabled = true;
        GameStarted = false; // Game is over, reset flag
      } else {
        messageDiv.textContent = ''; // Clear the message for the next row
        rows[currentRow].querySelector('.cell').focus();
      }
    }
  
    // Re-enable the timer options after the game ends
    document.querySelectorAll('input[name="timer"]').forEach(radio => {
      radio.disabled = false;
    });
  }

  function getFeedback(guess) {
    const feedback = [];
    const wordArr = correctWord.split('');
    const guessArr = guess.split('');

    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === wordArr[i]) {
        feedback.push('blue'); // Correct position
        wordArr[i] = null;
      } else if (wordArr.includes(guessArr[i])) {
        feedback.push('orange'); // Correct letter, wrong position
        wordArr[wordArr.indexOf(guessArr[i])] = null;
      } else {
        feedback.push('gray'); // Incorrect letter
      }
    }
    return feedback;
  }

  function updateKeyboardKey(letter, color) {
    const keyboardKeys = document.querySelectorAll('.key');
  
    // Loop through all the keys on the virtual keyboard
    keyboardKeys.forEach(key => {
      if (key.textContent.trim().toUpperCase() === letter.toUpperCase()) {
        // Update the key color based on the feedback color
        if (color === 'blue') {
          key.style.backgroundColor = '#0077CA'; // Correct position (highest priority)
          key.style.color = 'white';
        } else if (color === 'orange') {
          // Change to orange only if it's not currently blue
          if (key.style.backgroundColor !== 'rgb(0, 119, 202)') { 
            key.style.backgroundColor = '#E75D2A'; // Correct letter, wrong position
            key.style.color = 'white';
          }
        } else if (color === 'gray') {
          // Change to gray only if it's not blue or orange
          if (
            key.style.backgroundColor !== 'rgb(0, 119, 202)' && // Not blue
            key.style.backgroundColor !== 'rgb(231, 93, 42)' // Not orange
          ) {
            key.style.backgroundColor = 'gray'; // Incorrect letter
            key.style.color = 'white';
          }
        }
      }
    });
  }

  function displayFeedback(feedback) {
    const currentCells = rows[currentRow].querySelectorAll('.cell');
  
    feedback.forEach((color, index) => {
      const cell = currentCells[index];
      const letter = cell.value.toUpperCase();
  
      if (color === 'blue') {
        cell.style.backgroundColor = '#0077CA'; // Blue for correct position
        cell.style.color = 'white';
      } else if (color === 'orange') {
        cell.style.backgroundColor = '#E75D2A'; // Orange for correct letter, wrong position
        cell.style.color = 'white';
      } else {
        cell.style.backgroundColor = 'gray'; // Gray for incorrect letter
        cell.style.color = 'white';
      }
  
      updateKeyboardKey(letter, color); // Update keyboard key color
    });
  }

  document.querySelectorAll('.cell').forEach((cell, index, allCells) => {
    cell.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
  
      const currentCells = Array.from(rows[currentRow].querySelectorAll('.cell'));
      const currentCellIndex = currentCells.indexOf(cell);
  
      if (e.target.value.length === 1 && currentCellIndex < currentCells.length - 1) {
        currentCells[currentCellIndex + 1].focus();
      }
    });
  
    cell.addEventListener('keydown', (e) => {
      const key = e.key;
  
      if (key === "Backspace") {
        const currentCells = Array.from(rows[currentRow].querySelectorAll('.cell'));
        const currentCellIndex = currentCells.indexOf(cell);
        if (cell.value === '' && currentCellIndex > 0) {
          currentCells[currentCellIndex - 1].focus();
        }
      }
  
      if (!/^[a-zA-Z]$/.test(key) && key !== "Backspace" && key !== "Enter") {
        e.preventDefault();
      }
  
      if (key === "Enter") {
        submitCurrentRow();
      }
    });
  });

  infoButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});