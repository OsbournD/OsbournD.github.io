<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set Content-Type header for JSON response
header('Content-Type: application/json');

try {
    // Database connection settings
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

    // Get the JSON input from the client
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate JSON decoding
    if (!$input) {
        throw new Exception("Invalid JSON input");
    }

    // Extract values from the input
    $userID = isset($input['userID']) ? $input['userID'] : null;
    $score = isset($input['score']) ? $input['score'] : null;
    $waveReached = isset($input['waveReached']) ? $input['waveReached'] : null;
    $level = isset($input['level']) ? $input['level'] : null;

    // Validate required fields
    if (empty($userID) || empty($score) || empty($waveReached) || empty($level)) {
        throw new Exception("Missing required fields: userID, score, waveReached, or level");
    }

    // Get the username associated with the userID
	if($userID > 0) {
		$sql = "SELECT username FROM users WHERE userID = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$result = $stmt->get_result();

		// Check if the user exists
		if ($result->num_rows > 0) {
			// Get the username from the result
			$user = $result->fetch_assoc();
			$username = $user['username'];
		} else {
			throw new Exception("User not found");
		}
	} else {
		$username = 'guest';
	}

    // Prepare the SQL query to insert the score and username into the scores table
    $sql = "INSERT INTO scores (userID, score, waveReached, level, username) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // Check if statement preparation was successful
    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters (userID, score, waveReached, level, username)
    $stmt->bind_param("iiiis", $userID, $score, $waveReached, $level, $username);

    // Execute the SQL statement
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute SQL statement: " . $stmt->error);
    }

    // Send success response
    echo json_encode([
        "status" => "success",
        "message" => "Score added successfully"
    ]);
} catch (Exception $e) {
    // Send error response
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
