function goToMenu() {
  window.location.href = 'menu.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const goAgainBtn = document.querySelector('.go-again-btn');
  const messageDiv = document.querySelector('.message');
  const enterBtn = document.querySelector('.enter');
  const backspaceBtn = document.querySelector('.bksp');

  const infoButton = document.getElementById('info-btn');  //for how to play instructions
  const modal = document.getElementById('how-to-play-modal');
  const closeModal = modal.querySelector('.close');  //close button for the modal
  
  function moveToNextEmptyCell(currentCells) {
    for (let i = 0; i < currentCells.length; i++) {
      if (currentCells[i].value === '') {
        currentCells[i].focus();
        return;
      }
    }
  }

  const wordBank = ['student', 'teacher', 'courses', 'degrees', 'studies', 'faculty', 'program', 'lecture', 'Project','rainbow','physics','network','digital','backend','systems','program','analyze','machine','planner','hosting','booking','speaker','hunters','library','cupcake' ,'cookies' , 'pancake','hotdogs','burgers','dessert','muffins','timbits','varsity','seminar','academy','swimmer','compiler','eclipse','ellipse','vectors' , 'tension' , 'gravity','scholar']; // 7-letter OTU related words 
  
  function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    return wordBank[randomIndex];
  }

  enterBtn.disabled = true;
  
  let correctWord = selectRandomWord().toUpperCase();
  let currentRow = 0;
  const rows = document.querySelectorAll('.row');

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('keydown', (event) => {
      const currentCells = rows[currentRow].querySelectorAll('.cell');
      
      if (/^[a-zA-Z]$/.test(event.key)) { 
        // Allow only alphabetical keys
        event.preventDefault();
        for (let i = 0; i < currentCells.length; i++) {
          if (currentCells[i].value === '') {
            currentCells[i].value = event.key.toUpperCase(); // Normalize input to uppercase
            moveToNextEmptyCell(currentCells);
            break;
          }
        }
  
        // Check if all cells in the row are filled to enable the enter button
        const allFilled = Array.from(currentCells).every(cell => cell.value !== '');
        enterBtn.disabled = !allFilled;
  
      } else if (event.key === 'Backspace') {
        // Handle backspace to clear the previous cell
        event.preventDefault();
        for (let i = currentCells.length - 1; i >= 0; i--) {
          if (currentCells[i].value !== '') {
            currentCells[i].value = '';
            currentCells[i].focus();
            break;
          }
        }
  
        // Re-evaluate if the row is filled
        const allFilled = Array.from(currentCells).every(cell => cell.value !== '');
        enterBtn.disabled = !allFilled;
  
      } else if (event.key === 'Enter') {
        // Trigger the enter button click if all cells are filled
        event.preventDefault();
        if (!enterBtn.disabled) {
          enterBtn.click();
        }
  
      } else if (
        event.key.length === 1 && 
        !/^[a-zA-Z]$/.test(event.key) // Block special characters and numbers
      ) {
        // If the user tries to enter an invalid character, prevent it
        event.preventDefault();
      }
    });
  });
  
  //Enter the Content for on screen keyboard
  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
      const currentCells = rows[currentRow].querySelectorAll('.cell');
      
      for (let i = 0; i < currentCells.length; i++) {
        if (currentCells[i].value === '') {
          currentCells[i].value = key.textContent.toUpperCase();
          moveToNextEmptyCell(currentCells);
          break;
        }
      }
      
      const allFilled = Array.from(currentCells).every(cell => cell.value !== '');
      enterBtn.disabled = !allFilled;
    });
  });

  enterBtn.addEventListener('click', () => {
    const currentCells = rows[currentRow].querySelectorAll('.cell');
    const guess = Array.from(currentCells).map(cell => cell.value).join(''); //creating a string from the cell values

    if (guess.length < 7) {
      messageDiv.textContent = "Please enter a 7-letter word.";
      return;
    }

    const feedback = getFeedback(guess);
    displayFeedback(feedback);

    if (guess === correctWord) {
      messageDiv.textContent = "Congratulations! You've guessed the word.";
      enterBtn.disabled = true;
    } else {
      currentRow++;
      if (currentRow === rows.length) { //chances exhausted
        messageDiv.textContent = `Game Over! The word was: ${correctWord}`;
        enterBtn.disabled = true;
      } else {
        enterBtn.disabled = true;
      }
    }
  });

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
    resetGame();
  });

  function resetGame() {
    currentRow = 0;
    correctWord = selectRandomWord().toUpperCase(); // New word
  
    // Resetting all cells 
    document.querySelectorAll('.cell').forEach(cell => {
      cell.value = '';
      cell.style.backgroundColor = '';
      cell.style.color = '';
    });
  
    // Reset virtual keyboard keys
    document.querySelectorAll('.key').forEach(key => {
      key.style.backgroundColor = 'white';
      key.style.color = 'black'; 
    });
  
    // Reset enter button and message
    enterBtn.disabled = true;
    messageDiv.textContent = ''; 
  }

  function getFeedback(guess) {
      const feedback = [];
      const wordArr = correctWord.split('');
      const guessArr = guess.split('');
  
      // If the guess matches the word exactly, all cells should be blue
      if (guess === correctWord) {
          return Array(7).fill('blue'); // All feedback will be blue
      }
  
      // Check for correct letters but not in the correct position (wrong position)
      for (let i = 0; i < 7; i++) {
          if (wordArr.includes(guessArr[i])) {
              feedback.push('orange'); // Correct letter but in the wrong position
              wordArr[wordArr.indexOf(guessArr[i])] = null; // Mark as used to avoid duplicate matches
          } else {
              feedback.push('gray'); // Letter is not in the word at all
          }
      }
  
      return feedback;
  }
    

  function displayFeedback(feedback) {
      const currentCells = rows[currentRow].querySelectorAll('.cell');
      let allBlue = true; // Flag to check if all cells should be blue
      
      feedback.forEach((color, index) => {
        const cell = currentCells[index];
        const letter = cell.value.toUpperCase();
    
        // Update the keyboard key color for each guessed letter
        updateKeyboardKey(letter, color);
    
        if (color === 'orange') {
          cell.style.backgroundColor = '#E75D2A'; // Orange color for partial matches
          cell.style.color = 'black';
          allBlue = false; // Not all cells are blue
        } else if (color === 'gray') {
          cell.style.backgroundColor = 'gray'; // Gray color for incorrect letters
          cell.style.color = 'white';
          allBlue = false; // Not all cells are blue
        }
      });
    
      // If all feedback is blue, color the whole row blue
      if (allBlue) {
        currentCells.forEach(cell => {
          cell.style.backgroundColor = '#0077CA'; // Blue color for correct word
          cell.style.color = 'white';
        });
      }
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