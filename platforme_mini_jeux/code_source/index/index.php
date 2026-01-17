<!--Projet Prog Web - Hassan Charaf et Nawfel Chakib younes-->
<?php
    session_start();

    $is_connected = isset($_SESSION["email"]);

    if (isset($_GET["deconnexion"])) {
        session_destroy();
        header("Location: index.php");
        exit();
    }
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini jeux</title>
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <header>
      <h1>Bienvenue sur notre page de jeu</h1>
      <p>Découvrez et profitez de nos mini-jeux interactifs</p>
      <div class="right_btn">
        <?php if ($is_connected): ?>
          <a href="index.php?deconnexion=true"><button class="btn">Déconnexion</button></a>
        <?php else: ?>
          <a href="../profil/connexion.php"><button class="btn">Se connecter/Créer un profil</button></a>
        <?php endif; ?>
      </div>
      <div class="classement"><a href="../profil/classement.php"><button class="btn">Classements</button></a></div>
    </header>

    <main>
      <p class="intro">
        Voici toute la liste des jeux auxquels vous pouvez jouer :
      </p>

      <div class="jeu-container">
        <div class="jeu" data-icon="2048">
          <a href="../jeux/2048/2048.html">2048</a>
        </div>

        <div class="jeu" data-icon="✊✋✌️">
          <a href="../jeux/chifoumi/chifoumi.html">Chifoumi</a>
        </div>

        <div class="jeu" data-icon="🧠">
          <a href="../jeux/memoire/memoire.html">Mémoire</a>
        </div>

        <div class="jeu" data-icon="❌⭕">
          <a href="../jeux/tictactoe/tictactoe.html">Tic Tac Toe</a>
        </div>
      </div>
    </main>

    <footer>
      <p>&copy; 2025 - Crée par Hassan Charaf et Nawfel Chakib Younes</p>
    </footer>
  </body>
</html>
