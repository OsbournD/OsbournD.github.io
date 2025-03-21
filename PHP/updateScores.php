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
    $level = isset($input['level']) ? $input['level'] : null;
    $newScore = isset($input['score']) ? $input['score'] : null;
    $newWaveReached = isset($input['waveReached']) ? $input['waveReached'] : null;

    // Validate required fields
    if (empty($userID) || empty($newScore) || empty($newWaveReached) || empty($level)) {
        throw new Exception("Missing required fields: userID, score, waveReached, or level");
    }

    // Check if the user exists for the specified level
    $sql = "SELECT score, waveReached FROM scores WHERE userID = ? AND level = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->bind_param("ii", $userID, $level);
    $stmt->execute();
    $stmt->store_result();
    
    // Check if there is an existing record
    if ($stmt->num_rows === 0) {
        throw new Exception("No existing score found for userID: $userID and level: $level");
    }

    // Fetch the current values
    $stmt->bind_result($currentScore, $currentWaveReached);
    $stmt->fetch();

    // Now update the score and waveReached if the new score is higher or any other condition
    $updateSql = "UPDATE scores SET score = ?, waveReached = ? WHERE userID = ? AND level = ?";
    $updateStmt = $conn->prepare($updateSql);
    
    if (!$updateStmt) {
        throw new Exception("Failed to prepare update SQL statement: " . $conn->error);
    }

    // Bind new parameters (newScore, newWaveReached, userID, level)
    $updateStmt->bind_param("iiii", $newScore, $newWaveReached, $userID, $level);
    
    // Execute the SQL statement
    if ($updateStmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Score and data updated successfully for userID: $userID and level: $level"
        ]);
    } else {
        throw new Exception("Failed to update score and data: " . $updateStmt->error);
    }

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
    if (isset($updateStmt) && $updateStmt instanceof mysqli_stmt) {
        $updateStmt->close();
    }
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>

