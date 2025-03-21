<?php
header('Content-Type: application/json');

try {
    // Database connection settings
	$servername = "proj-mysql.uopnet.plymouth.ac.uk";
	$username = "comp2003_30";
	$password = "IusdL339+";
	$dbname = "comp2003_30";
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

    // Prepare an SQL query to find the user in the `users` table
    $sql = "SELECT password FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "status" => "error",
            "message" => "Error preparing statement: " . $conn->error
        ]);
        exit;
    }

    // Bind parameters
    $stmt->bind_param("s", $userName);

    // Execute the statement
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // No user found
        echo json_encode([
            "status" => "error",
            "message" => "Invalid username or password"
        ]);
        exit;
    }

    // Fetch the user's hashed password
    $row = $result->fetch_assoc();
    $hashedPassword = $row['password'];

    // Verify the provided password against the stored hashed password
    if (password_verify($userPassword, $hashedPassword)) {
        // Login successful
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
        ]);
    } else {
        // Invalid password
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
    // Close the statement and connection
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>
