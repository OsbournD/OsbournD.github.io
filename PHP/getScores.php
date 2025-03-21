<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set Content-Type header for JSON response
header('Content-Type: application/json');

try {
    // Database connection settings (replace with your actual values)
    $servername = "proj-mysql.uopnet.plymouth.ac.uk";
	$username = "comp2003_30";
	$password = "IusdL339+";
	$dbname = "comp2003_30";

    // Create a connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check database connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get the JSON input from the client (POST request)
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate JSON decoding
    if (!$input) {
        throw new Exception("Invalid JSON input");
    }

    // Extract values from the input
    $userID = isset($input['userID']) ? $input['userID'] : null;
    $level = isset($input['level']) ? $input['level'] : null;

    // Validate required fields
    if (empty($userID) || empty($level)) {
        throw new Exception("Missing required fields: userID or level");
    }

    // Prepare SQL query to get the highest score for the given userID and level
    $sql = "SELECT MAX(score) AS highscore FROM scores WHERE userID = ? AND level = ?";
    $stmt = $conn->prepare($sql);

    // Check if statement preparation was successful
    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters (userID and level)
    $stmt->bind_param("ii", $userID, $level);

    // Execute the SQL statement
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute SQL statement: " . $stmt->error);
    }

    // Get the result
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Check if a high score was found
    if ($row) {
        $highscore = $row['highscore'];
        echo json_encode([
            "status" => "success",
            "highscore" => $highscore
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No high score found for this userID and level."
        ]);
    }
} catch (Exception $e) {
    // Send error response if any exception occurs
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    // Close the statement and connection if they exist
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
