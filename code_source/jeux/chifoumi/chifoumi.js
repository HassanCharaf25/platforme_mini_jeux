let resetBtn = document.getElementById("reset");
let scoreJoueur = document.getElementById("score-joueur");
let scoreOrdinateur = document.getElementById("score-ordinateur");
let btnJoueur = [...document.getElementsByClassName("btn-joueur")];
let opierreBtn = document.getElementById("opierre");
let ofeuilleBtn = document.getElementById("ofeuille");
let ociseauxBtn = document.getElementById("ociseaux");
let message = document.getElementById("message");
let nextBtn = document.getElementById("next");
let differenceScore = document.getElementById("difference-score");
let scoreJoueurVal = 0;
let scoreOrdinateurVal = 0;
let jeuTermine = false;
const MAX_SCORE = 10;

const PIERRE = "pierre";
const FEUILLE = "feuille";
const CISEAUX = "ciseaux";

const jouerManche = (e) => {
  if (jeuTermine) return;

  let choix = e.currentTarget;

  btnJoueur.forEach((btn) => {
    btn.classList.add("desactivated");
    btn.removeEventListener("click", jouerManche);
  });

  choix.classList.remove("desactivated");
  choix.classList.add("active");

  let choixJoueur = choix.id;

  let choixOrdi = faireChoixOrdinateur();

  verifierGagnant(choixJoueur, choixOrdi);

  nextBtn.style.visibility = "visible";
};

const faireChoixOrdinateur = () => {
  let nbAleatoire = Math.floor(Math.random() * 3);

  switch (nbAleatoire) {
    case 0:
      opierreBtn.classList.add("active");
      return PIERRE;
    case 1:
      ofeuilleBtn.classList.add("active");
      return FEUILLE;
    default:
      ociseauxBtn.classList.add("active");
      return CISEAUX;
  }
};

const updateDifference = () => {
  let difference = scoreJoueurVal - scoreOrdinateurVal;
  differenceScore.textContent = difference;
};

const verifierGagnant = (choixJoueur, choixOrdi) => {
  if (choixJoueur == choixOrdi) {
    message.textContent = "Egalité !";
    return;
  }

  if (choixJoueur == PIERRE) {
    if (choixOrdi == FEUILLE) {
      return victoireOrdinateur();
    } else if (choixOrdi == CISEAUX) {
      return victoireJoueur();
    }
  }

  if (choixJoueur == FEUILLE) {
    if (choixOrdi == CISEAUX) {
      return victoireOrdinateur();
    } else if (choixOrdi == PIERRE) {
      return victoireJoueur();
    }
  }

  if (choixJoueur == CISEAUX) {
    if (choixOrdi == PIERRE) {
      return victoireOrdinateur();
    } else if (choixOrdi == FEUILLE) {
      return victoireJoueur();
    }
  }
};

const victoireOrdinateur = () => {
  message.textContent = "L'ordinateur gagne ...";
  scoreOrdinateurVal++;
  scoreOrdinateur.textContent = scoreOrdinateurVal;
  updateDifference();
  verifierVictoire();
};

const victoireJoueur = () => {
  message.textContent = "Vous avez gagné ! :)";
  scoreJoueurVal++;
  scoreJoueur.textContent = scoreJoueurVal;
  updateDifference();
  verifierVictoire();
};

const verifierVictoire = () => {
  if (scoreJoueurVal >= MAX_SCORE || scoreOrdinateurVal >= MAX_SCORE) {
    jeuTermine = true;
    btnJoueur.forEach((btn) => {
      btn.classList.add("desactivated");
      btn.removeEventListener("click", jouerManche);
    });

    nextBtn.style.visibility = "hidden";

    if (scoreJoueurVal >= MAX_SCORE) {
      message.textContent = "Félicitations ! Vous avez gagné la partie !";
      const scoreDifference = scoreJoueurVal - scoreOrdinateurVal;
      const scoreFinal = MAX_SCORE * 10 + scoreDifference * 5;
      envoyerScore(scoreFinal);
    } else {
      message.textContent = "L'ordinateur a gagné la partie ...";
    }
  }
};

function envoyerScore(score) {
    if (score <= 0) return;
    
    const formData = new FormData();
    formData.append('jeu', 'chifoumi');
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
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else {
            console.error('Erreur:', data.message);
        }
    })
    .catch(error => {
        console.error('Erreur fetch:', error);
    });
}

const preparerNouvelleManche = () => {
  if (jeuTermine) {
    nextBtn.style.visibility = "hidden";
    return;
  }
  btnJoueur.forEach((btn) => {
    btn.classList.remove("desactivated");
    btn.classList.remove("active");

    btn.addEventListener("click", jouerManche);
  });
  [opierreBtn, ofeuilleBtn, ociseauxBtn].forEach((btn) =>
    btn.classList.remove("active")
  );
  message.textContent = "A vous de jouer !";
  nextBtn.style.visibility = "hidden";
};

nextBtn.addEventListener("click", preparerNouvelleManche);

btnJoueur.forEach((btn) => btn.addEventListener("click", jouerManche));

resetBtn.addEventListener("click", () => {
  scoreJoueurVal = 0;
  scoreOrdinateurVal = 0;
  scoreJoueur.textContent = 0;
  scoreOrdinateur.textContent = 0;
  differenceScore.textContent = 0;
  jeuTermine = false;
  preparerNouvelleManche();
});

document.addEventListener("DOMContentLoaded", () => {
  preparerNouvelleManche();
});
