<?php
// Database connection details
// Update these values with your Hostinger MySQL Database details!
define('DB_HOST', 'localhost');
define('DB_NAME', 'u402759017_art_studio');      // Replace with your DB Name
define('DB_USER', 'root');    // Replace with your DB Username
define('DB_PASS', ''); // Replace with your DB Password

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
//Server Pass Harsh@2026
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failed",
        "message" => $e->getMessage(),
        "hint" => "Please update DB credentials in public/api/db.php with your Hostinger MySQL settings."
    ]);
    exit;
}
