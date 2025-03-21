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

    // Check if the connection was successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Decode JSON payload
    $input = file_get_contents('php://input');
    $data = json_decode($input, true); // Convert JSON string to associative array

    // Check if required fields are present
    if (!isset($data['username']) || !isset($data['password'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid input: username or password is missing"
        ]);
        exit;
    }

    $userName = $data['username']; // Get the username from the decoded JSON
    $userPassword = $data['password']; // Get the raw password from the decoded JSON
	$userDisplay = $data['displayName'];
	$userClass = $data['classCode'];
    // Hash the password using PHP's password_hash function for security
    $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);

    // Prepare an SQL query to insert the new user into the `users` table
    $sql = "INSERT INTO users (username, password, display_name, class_code) VALUES (?, ?, ?, ?)";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "status" => "error",
            "message" => "Error preparing statement: " . $conn->error
        ]);
        exit;
    }

    // Bind parameters (username, hashed password)
    $stmt->bind_param("ssss", $userName, $hashedPassword, $userDisplay, $userClass);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "User added successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Error: " . $stmt->error
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    // Close the statement and connection
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>

