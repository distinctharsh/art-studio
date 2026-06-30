<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Auth check
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (empty($authHeader)) {
    echo json_encode(["success" => false, "error" => "No token provided"]);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);
$decoded = base64_decode($token);
$user_id = 0;

if (strpos($decoded, 'user_') === 0) {
    $parts = explode('_', $decoded);
    $user_id = intval($parts[1]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid token"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        $orders = $stmt->fetchAll();
        echo json_encode($orders);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database error"]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $painting_id = $data->painting_id ?? 'custom';
    $amount = $data->amount ?? '';
    
    try {
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, painting_id, total_amount, status) VALUES (?, ?, ?, 'Pending')");
        $stmt->execute([$user_id, $painting_id, $amount]);
        echo json_encode(["success" => true, "order_id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database error"]);
    }
}
else {
    echo json_encode(["success" => false, "error" => "Invalid method"]);
}
?>
