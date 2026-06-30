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

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->name) || empty($data->username) || empty($data->email) || empty($data->password)) {
        echo json_encode(["success" => false, "error" => "All required fields must be filled"]);
        exit;
    }
    
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    $phone = $data->phone ?? '';
    
    try {
        // Check if email or username exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email=? OR username=?");
        $stmt->execute([$data->email, $data->username]);
        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Email or username already exists"]);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO users (name, username, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data->name, $data->username, $data->email, $phone, $password_hash]);
        
        $user_id = $pdo->lastInsertId();
        $token = base64_encode("user_" . $user_id . "_" . time()); // Simple token
        echo json_encode(["success" => true, "token" => $token, "user_id" => $user_id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database error"]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email) || empty($data->password)) {
        echo json_encode(["success" => false, "error" => "Email and password are required"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email=?");
        $stmt->execute([$data->email]);
        $user = $stmt->fetch();
        
        if ($user) {
            if (password_verify($data->password, $user['password_hash'])) {
                $token = base64_encode("user_" . $user['id'] . "_" . time());
                echo json_encode(["success" => true, "token" => $token]);
            } else {
                echo json_encode(["success" => false, "error" => "Invalid password"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "User not found"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database error"]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'me') {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (empty($authHeader)) {
        echo json_encode(["success" => false, "error" => "No token provided"]);
        exit;
    }
    
    $token = str_replace('Bearer ', '', $authHeader);
    $decoded = base64_decode($token);
    
    if (strpos($decoded, 'user_') === 0) {
        $parts = explode('_', $decoded);
        $user_id = intval($parts[1]);
        
        try {
            $stmt = $pdo->prepare("SELECT id, name, username, email, phone, created_at FROM users WHERE id=?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            
            if ($user) {
                echo json_encode(["success" => true, "user" => $user]);
            } else {
                echo json_encode(["success" => false, "error" => "User not found"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Database error"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Invalid token"]);
    }
}
else {
    echo json_encode(["success" => false, "error" => "Invalid action"]);
}
?>
