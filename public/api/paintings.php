<?php
require_once 'db.php';

header("Content-Type: application/json");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Verify authentication for POST, PUT, DELETE
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
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
        // Return all paintings
        try {
            $stmt = $pdo->query("SELECT * FROM paintings ORDER BY created_at DESC");
            $paintings = $stmt->fetchAll();
            echo json_encode($paintings);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch paintings"]);
        }
        break;
        
    case 'POST':
        // Create new painting
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['id']) || !isset($data['title']) || !isset($data['medium']) || 
            !isset($data['dimensions']) || !isset($data['year']) || !isset($data['price']) || !isset($data['image'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("INSERT INTO paintings (id, title, medium, dimensions, year, status, price, image, description) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['id'],
                $data['title'],
                $data['medium'],
                $data['dimensions'],
                $data['year'],
                $data['status'] ?? 'Available',
                $data['price'],
                $data['image'],
                $data['description'] ?? null
            ]);
            
            http_response_code(201);
            echo json_encode(["message" => "Painting created successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create painting"]);
        }
        break;
        
    case 'PUT':
        // Update existing painting
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing painting ID"]);
            exit;
        }
        
        try {
            // Build dynamic update query
            $fields = [];
            $params = [];
            
            if (isset($data['title'])) { $fields[] = "title = ?"; $params[] = $data['title']; }
            if (isset($data['medium'])) { $fields[] = "medium = ?"; $params[] = $data['medium']; }
            if (isset($data['dimensions'])) { $fields[] = "dimensions = ?"; $params[] = $data['dimensions']; }
            if (isset($data['year'])) { $fields[] = "year = ?"; $params[] = $data['year']; }
            if (isset($data['status'])) { $fields[] = "status = ?"; $params[] = $data['status']; }
            if (isset($data['price'])) { $fields[] = "price = ?"; $params[] = $data['price']; }
            if (isset($data['image'])) { $fields[] = "image = ?"; $params[] = $data['image']; }
            if (isset($data['description'])) { $fields[] = "description = ?"; $params[] = $data['description']; }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(["error" => "No fields to update"]);
                exit;
            }
            
            $params[] = $data['id'];
            $sql = "UPDATE paintings SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            echo json_encode(["message" => "Painting updated successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update painting"]);
        }
        break;
        
    case 'DELETE':
        // Delete painting
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing painting ID"]);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM paintings WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(["message" => "Painting deleted successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete painting"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
