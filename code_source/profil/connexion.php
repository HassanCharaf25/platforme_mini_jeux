<?php
    session_start();

    $host = "localhost";
    $dbname = "mini_jeux";
    $user = "root";
    $pass = "";

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    } catch (PDOException $e) {
        die("Erreur de connexion : " . $e->getMessage());
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $email = $_POST["email"];
        $password = $_POST["password"];

        $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['username'] = $user['username'];
            header("Location: ../index/index.php");
            exit();
        } else {
            $_SESSION["erreur"] = "Email ou mot de passe incorrect.";
            header("Location: connexion.php");
            exit();
        }
    }
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
    <link rel="stylesheet" href="connexion.css">
</head>
<body>
    <h1>Connexion</h1>
    <button id="back-button" onclick="window.location.href='../index/index.php'">
      Retour à l'accueil
    </button>
    <?php 
    if (isset($_SESSION['erreur'])) { 
        echo "<p style='color:red;'>".$_SESSION['erreur']."</p>"; 
        unset($_SESSION['erreur']);
    }
    ?>

    <form method="post" action="connexion.php">
        <label>Email :</label>
        <input type="email" name="email" required><br><br>

        <label>Mot de passe :</label>
        <input type="password" name="password" required><br><br>

        <button class="btn" type="submit">Se connecter</button>
    </form>

    <p>Vous n'avez pas de compte ? <a href="inscription.php">Inscrivez-vous ici</a></p>
</body>
</html>
