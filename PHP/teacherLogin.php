<?php
header('Content-Type: application/json');

try {
// Database connection settings
	$servername = "proj-mysql.uopnet.plymouth.ac.uk";  // Replace with your database host
	$username = "comp2003_30"; // Replace with your database username
	$password = "IusdL339+"; // Replace with your database password
	$dbname = "comp2003_30";   // Replace with your database name
    // Create a connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['username']) || !isset($data['password'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid input: username or password is missing"
        ]);
        exit;
    }

    $userName = $data['username'];
    $userPassword = $data['password'];

    $sql = "SELECT teacherId, password FROM teachers WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("s", $userName);
    if (!$stmt->execute()) {
        throw new Exception("Error executing statement: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $teacher = $result->fetch_assoc();

    if ($teacher && password_verify($userPassword, $teacher['password'])) {
        echo json_encode([
            "status" => "success",
            "teacherId" => $teacher['teacherId']
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid username or password"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>