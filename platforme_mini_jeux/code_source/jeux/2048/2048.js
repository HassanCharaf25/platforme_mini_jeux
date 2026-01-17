let grille = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let nbVide = 16;
let gameOverDeclenche = false;

function construireGrille() {
  let table = "<table>";
  for (let i = 0; i < 4; i++) {
    table += "<tr>";
    for (let j = 0; j < 4; j++) {
      let val = grille[i][j];
      if (val !== 0) {
        table += `<td>${val}</td>`;
      } else {
        table += "<td></td>";
      }
    }
    table += "</tr>";
  }
  table += "</table>";
  document.getElementById("grille").innerHTML = table;
}

function afficheScore() {
  $("#score").text(score);
}

function caseVide(i, x) {
  let k = 0;
  for (let ligne = 0; ligne < 4; ligne++) {
    for (let col = 0; col < 4; col++) {
      if (grille[ligne][col] == 0) {
        if (k == i) {
          grille[ligne][col] = x;
          nbVide--;
          return;
        }
        k++;
      }
    }
  }
}

function nouvelle() {
  gameOverDeclenche = false;
  score = 0;
  afficheScore();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      grille[i][j] = 0;
    }
  }
  nbVide = 16;

  let i1 = Math.floor(Math.random() * nbVide);
  caseVide(i1, 2);
  let i2 = Math.floor(Math.random() * nbVide);
  caseVide(i2, 2);

  construireGrille();
}

function mouvementsPossibles() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grille[i][j] === 0) return true;
      if (j < 3 && grille[i][j] === grille[i][j+1]) return true;
      if (i < 3 && grille[i][j] === grille[i+1][j]) return true;
    }
  }
  return false;
}

function glisse(direction) {
  let modifie = false;

  function fusionLigne(ligne) {
    let filtres = ligne.filter((x) => x !== 0);
    let resultat = [];
    for (let j = 0; j < filtres.length; j++) {
      if (j + 1 < filtres.length && filtres[j] === filtres[j + 1]) {
        resultat.push(filtres[j] * 2);
        score += filtres[j] * 2;
        j++;
      } else {
        resultat.push(filtres[j]);
      }
    }
    while (resultat.length < 4) {
      resultat.push(0);
    }
    return resultat;
  }

  function transpose(grille) {
    let result = [];
    for (let i = 0; i < 4; i++) {
      result[i] = [];
      for (let j = 0; j < 4; j++) {
        result[i][j] = grille[j][i];
      }
    }
    return result;
  }

  function reverse(grille) {
    return grille.map((row) => row.slice().reverse());
  }

  let copie = JSON.parse(JSON.stringify(grille));

  if (direction === "g") {
    for (let i = 0; i < 4; i++) {
      grille[i] = fusionLigne(grille[i]);
    }
  } else if (direction === "d") {
    for (let i = 0; i < 4; i++) {
      grille[i] = fusionLigne(grille[i].slice().reverse()).reverse();
    }
  } else if (direction === "h") {
    grille = transpose(grille);
    for (let i = 0; i < 4; i++) {
      grille[i] = fusionLigne(grille[i]);
    }
    grille = transpose(grille);
  } else if (direction === "b") {
    grille = transpose(grille);
    for (let i = 0; i < 4; i++) {
      grille[i] = fusionLigne(grille[i].slice().reverse()).reverse();
    }
    grille = transpose(grille);
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grille[i][j] !== copie[i][j]) {
        modifie = true;
      }
    }
  }

  nbVide = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grille[i][j] === 0) nbVide++;
    }
  }

  if (modifie) {
    afficheScore();
    construireGrille();
  }

  return modifie;
}

function gameOver() {
  if (gameOverDeclenche) return;
  gameOverDeclenche = true;

  document.getElementById("score").innerText = score + " - Game over";
  envoyerScore(score);
}

function envoyerScore(score) {
  if (score <= 0) return;

  const formData = new FormData();
  formData.append('jeu', '2048');
  formData.append('score', score);

  fetch('../../profil/enregistrer_score.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const notification = document.createElement('div');
      notification.textContent = 'Score enregistré au classement !';
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.padding = '10px 20px';
      notification.style.backgroundColor = '#8f7a66';
      notification.style.color = 'white';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '1000';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } else {
      if (data.message.includes('connecté')) {
        if (confirm('Vous devez être connecté pour enregistrer votre score. Voulez-vous vous connecter maintenant ?')) {
          window.location.href = '../../profil/connexion.php';
        }
      }
    }
  })
  .catch(error => console.error('Erreur:', error));
}

window.onload = function () {
  nouvelle();
  document.getElementById("nouvelle-partie").addEventListener("click", nouvelle);
};

document.addEventListener("keydown", function (k) {
  let direction = null;

  if (k.which === 37) direction = "g";
  else if (k.which === 38) direction = "h";
  else if (k.which === 39) direction = "d";
  else if (k.which === 40) direction = "b";

  if (direction !== null && !gameOverDeclenche) {
    let modifie = glisse(direction);

    if (modifie) {
      let i = Math.floor(Math.random() * nbVide);
      caseVide(i, Math.random() < 0.9 ? 2 : 4);
      construireGrille();
      afficheScore();

      if (!mouvementsPossibles()) {
        gameOver();
      }
    }
  }
});

