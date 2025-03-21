<?php
error_reporting(0);
header('Content-Type: application/json');

try {
    $servername = "proj-mysql.uopnet.plymouth.ac.uk";
    $username = "comp2003_30";
    $password = "IusdL339+";
    $dbname = "comp2003_30";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $input = file_get_contents('php://input');
    if (!$input) {
        throw new Exception("No input received");
    }

    $data = json_decode($input, true);
    if (!$data) {
        throw new Exception("Invalid JSON");
    }

    if (!isset($data['username']) || !isset($data['password'])) {
        throw new Exception("Missing username or password");
    }

    $stmt = $conn->prepare("SELECT password, userID, display_name FROM users WHERE username = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $data['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($data['password'], $user['password'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid username or password"
        ]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "UserID" => $user['userID'],
        "displayName" => $user['display_name']
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}