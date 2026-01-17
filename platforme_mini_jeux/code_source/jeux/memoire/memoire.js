const cards = document.querySelectorAll(".memory-card");
const winMessage = document.getElementById("win-message");
const finalScoreElement = document.getElementById("final-score");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flipCount = 0;
let timer;
let startTime;
let elapsedTime = 0;
let gameEnded = false;
let matchedPairs = 0;
const totalPairs = 6;

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("flip"))
    return;

  if (!startTime) {
    startTime = Date.now();
    timer = setInterval(updateScoreDisplay, 1000);
  }

  this.classList.add("flip");
  flipCount++;
  updateScoreDisplay();

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    firstCard.classList.add("celebrate");
    secondCard.classList.add("celebrate");
    setTimeout(() => {
      firstCard.classList.remove("celebrate");
      secondCard.classList.remove("celebrate");
    }, 500);
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matchedPairs++;

  if (matchedPairs === totalPairs) {
    endGame();
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1200);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function restartGame() {
  winMessage.classList.remove("show");

  cards.forEach((card) => {
    card.classList.remove("flip");
    card.addEventListener("click", flipCard);
  });

  resetBoard();
  matchedPairs = 0;
  flipCount = 0;
  elapsedTime = 0;
  startTime = null;
  gameEnded = false;

  clearInterval(timer);

  updateScoreDisplay();

  setTimeout(() => {
    shuffleCards();
  }, 300);
}

function updateScoreDisplay() {
  const timeDisplay = document.getElementById("time");
  const flipDisplay = document.getElementById("flips");
  const scoreDisplay = document.getElementById("score");
  
  if (!timeDisplay || !flipDisplay || !scoreDisplay) {
    console.error("Éléments d'affichage manquants");
    return;
  }
  
  if (startTime) {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = `Temps : ${elapsedTime}s`;
  } else {
    timeDisplay.textContent = "Temps : 0s";
  }
  
  flipDisplay.textContent = `Flips : ${flipCount}`;
  
  const score = calculateScore(elapsedTime, flipCount);
  scoreDisplay.textContent = `Score : ${score}`;
}

function calculateScore(time, flips) {
  const baseScore = 500;
  const minFlips = totalPairs * 2;
  
  const timePenalty = Math.min(300, Math.floor(time * 3));
  const excessFlips = Math.max(0, flips - minFlips);
  const flipPenalty = Math.min(200, Math.floor(excessFlips * 5));
  
  let score = baseScore - timePenalty - flipPenalty;
  
  if (time < 25 && flips <= minFlips) {
    score += 200;
  } else if (time < 40 && flips <= minFlips + 4) {
    score += 100;
  } else if (time < 60 && flips <= minFlips + 8) {
    score += 50;
  }
  
  return Math.max(50, Math.min(700, score));
}

function shuffleCards() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

shuffleCards();
cards.forEach((card) => card.addEventListener("click", flipCard));
document.getElementById("restart-btn").addEventListener("click", restartGame);

updateScoreDisplay();

function endGame() {
    clearInterval(timer);
    gameEnded = true;

    let score = calculateScore(elapsedTime, flipCount);

    const scoreDisplay = document.getElementById("score");
    if (scoreDisplay) scoreDisplay.textContent = `Score : ${score}`;

    if (finalScoreElement) finalScoreElement.textContent = score;

    envoyerScore(score);

    setTimeout(() => {
        winMessage.classList.add("show");
    }, 1000);
}

function envoyerScore(score) {
    const formData = new FormData();
    formData.append('jeu', 'memoire');
    formData.append('score', score);
    
    fetch('../../profil/enregistrer_score.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Score enregistré avec succès');
        } else {
            console.error('Erreur:', data.message);
            if (data.message.includes('connecté')) {
                if (confirm('Vous devez être connecté pour enregistrer votre score. Voulez-vous vous connecter maintenant ?')) {
                    window.location.href = '../../profil/connexion.php';
                }
            }
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}