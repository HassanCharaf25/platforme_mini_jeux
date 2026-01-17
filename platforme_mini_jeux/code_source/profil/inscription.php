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
        $username = $_POST["username"];
        $email = $_POST["email"];
        $password = $_POST["password"];
        $birthdate = $_POST["birthdate"];

        $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
        $stmt->execute([$email]);
        $existing_user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing_user) {
            $_SESSION['erreur'] = "L'email est déjà utilisé.";
        } else {
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("INSERT INTO utilisateurs (username, email, password, birthdate) VALUES (?, ?, ?, ?)");
            $stmt->execute([$username, $email, $hashed_password, $birthdate]);

            $_SESSION["username"] = $username;
            $_SESSION["email"] = $email;
            $_SESSION["birthdate"] = $birthdate;

            header("Location: ../index/index.php");
            exit();
        }
    }
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
    <link rel="stylesheet" href="inscription.css">
</head>
<body>
    <h2>Inscription</h2>
    <button id="back-button" onclick="window.location.href='../index/index.php'">
      Retour à l'accueil
    </button>
    <?php
    if (isset($_SESSION['erreur'])) {
        echo "<p style='color:red;'>".$_SESSION['erreur']."</p>";
        unset($_SESSION['erreur']);
    }
    ?>

    <form method="POST" action="inscription.php">
        <label>Nom d'utilisateur :</label>
        <input type="text" name="username" required><br><br>

        <label>Email :</label>
        <input type="email" name="email" required><br><br>

        <label>Mot de passe :</label>
        <input type="password" name="password" required><br><br>

        <label>Date de naissance :</label>
        <input type="date" name="birthdate" required><br><br>

        <button type="submit">S'inscrire</button>
    </form>
    <p>Vous avez déjà un compte ? <a href="connexion.php">Connectez-vous ici</a></p>
</body>
</html>
