<?php
session_start();

$host = "localhost";
$dbname = "mini_jeux";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$jeu = isset($_GET['jeu']) ? $_GET['jeu'] : 'memoire';

$jeux_disponibles = ['memoire', '2048', 'chifoumi', 'tictactoe'];

if (!in_array($jeu, $jeux_disponibles)) {
    $jeu = 'memoire';
}

$stmt = $pdo->prepare("
    SELECT u.username, s.user_id, s.score, s.date_partie 
    FROM scores s
    JOIN utilisateurs u ON s.user_id = u.id
    WHERE s.jeu = ?
    ORDER BY s.score DESC
    LIMIT 10
");
$stmt->execute([$jeu]);
$top_scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

$user_best_score = null;
if (isset($_SESSION['email'])) {
    $stmt = $pdo->prepare("
        SELECT s.score, s.date_partie 
        FROM scores s
        JOIN utilisateurs u ON s.user_id = u.id
        WHERE s.jeu = ? AND u.email = ?
        ORDER BY s.score DESC
        LIMIT 1
    ");
    $stmt->execute([$jeu, $_SESSION['email']]);
    $user_best_score = $stmt->fetch(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classement - <?php echo ucfirst($jeu); ?></title>
    <link rel="stylesheet" href="classement.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <button id="back-button" onclick="window.location.href='../index/index.php'">
        Retour à l'accueil
    </button>

    <div class="classement-container">
        <h1>Classement - <?php echo ucfirst($jeu); ?></h1>
        
        <div class="jeux-navigation">
            <?php foreach ($jeux_disponibles as $jeu_item): ?>
                <a href="?jeu=<?php echo $jeu_item; ?>" class="<?php echo $jeu === $jeu_item ? 'active' : ''; ?>">
                    <?php echo ucfirst($jeu_item); ?>
                </a>
            <?php endforeach; ?>
        </div>
        
        <?php if ($user_best_score): ?>
            <div class="user-score">
                <h3>Votre meilleur score</h3>
                <p><?php echo htmlspecialchars($user_best_score['score']); ?> points</p>
                <p class="date">le <?php echo date('d/m/Y à H:i', strtotime($user_best_score['date_partie'])); ?></p>
            </div>
        <?php endif; ?>
        
        <table class="scores-table">
            <thead>
                <tr>
                    <th>Rang</th>
                    <th>Joueur</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($top_scores) > 0): ?>
                    <?php foreach ($top_scores as $index => $score): ?>
                        <tr class="<?php echo isset($_SESSION['user_id']) && $score['user_id'] == $_SESSION['user_id'] ? 'current-user' : ''; ?>">
                            <td><?php echo $index + 1; ?></td>
                            <td><?php echo htmlspecialchars($score['username']); ?></td>
                            <td><?php echo htmlspecialchars($score['score']); ?></td>
                            <td><?php echo date('d/m/Y', strtotime($score['date_partie'])); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4">Aucun score enregistré pour ce jeu</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const userRow = document.querySelector('.current-user');
            if (userRow) {
                setTimeout(() => {
                    userRow.classList.add('highlight');
                }, 500);
            }
        });
    </script>
</body>
</html>