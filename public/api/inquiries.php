<?php
require_once 'db.php';

header("Content-Type: application/json");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Verify authentication for GET and PUT requests (admin only)
if ($method === 'GET' || $method === 'PUT') {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!$authHeader) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    
    // Verify token against admin_settings
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM admin_settings WHERE setting_key = 'admin_token'");
        $stmt->execute();
        $result = $stmt->fetch();
        
        if (!$result || $authHeader !== 'Bearer ' . $result['setting_value']) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid token"]);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error"]);
        exit;
    }
}

switch ($method) {
    case 'GET':
        // Return all inquiries (admin only)
        try {
            $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY created_at DESC");
            $inquiries = $stmt->fetchAll();
            echo json_encode($inquiries);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch inquiries"]);
        }
        break;
        
    case 'POST':
        // Create new inquiry (public)
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, subject, artwork, message) 
                                   VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['subject'],
                $data['artwork'] ?? 'None',
                $data['message']
            ]);
            
            http_response_code(201);
            echo json_encode(["message" => "Inquiry submitted successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to submit inquiry"]);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['id']) || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(["message" => "Status updated successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update status"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
