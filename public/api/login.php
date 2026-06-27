<?php
require_once 'db.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Password is required"]);
    exit;
}

try {
    // Get stored password hash
    $stmt = $pdo->prepare("SELECT setting_value FROM admin_settings WHERE setting_key = 'admin_password'");
    $stmt->execute();
    $result = $stmt->fetch();
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => "Admin not configured"]);
        exit;
    }
    
    // Verify password
    if (!password_verify($data['password'], $result['setting_value'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid password"]);
        exit;
    }
    
    // Generate session token
    $token = bin2hex(random_bytes(32));
    
    // Store token in database
    $stmt = $pdo->prepare("INSERT INTO admin_settings (setting_key, setting_value) VALUES ('admin_token', ?) 
                           ON DUPLICATE KEY UPDATE setting_value = ?");
    $stmt->execute([$token, $token]);
    
    // Return token
    echo json_encode([
        "success" => true,
        "token" => $token,
        "message" => "Login successful"
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
