<?php
session_start();

if (!isset($_SESSION['email'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Vous devez être connecté pour enregistrer un score']);
    exit;
}

$host = "localhost";
$dbname = "mini_jeux";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['jeu']) && isset($_POST['score'])) {
    $jeu = $_POST['jeu'];
    $score = (int)$_POST['score'];
    
    $stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ?");
    $stmt->execute([$_SESSION['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé']);
        exit;
    }
    
    $user_id = $user['id'];
    
    try {
        $stmt = $pdo->prepare("INSERT INTO scores (user_id, jeu, score) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $jeu, $score]);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Score enregistré avec succès']);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du score: ' . $e->getMessage()]);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
}
?>