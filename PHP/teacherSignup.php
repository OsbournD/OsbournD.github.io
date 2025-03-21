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
   $classCode = $data['classCode'];
   $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);

   // First insert teacher
   $sql = "INSERT INTO teachers (username, password) VALUES (?, ?)";
   $stmt = $conn->prepare($sql);
   if (!$stmt) {
       throw new Exception("Error preparing teacher statement: " . $conn->error);
   }

   $stmt->bind_param("ss", $userName, $hashedPassword);
   if (!$stmt->execute()) {
       throw new Exception("Error inserting teacher: " . $stmt->error);
   }

   $teacherId = $conn->insert_id;
   $stmt->close();

   // Then create class
   $sql = "INSERT INTO classes (teacherId, classCode) VALUES (?, ?)";
   $stmt = $conn->prepare($sql);
   if (!$stmt) {
       throw new Exception("Error preparing class statement: " . $conn->error);
   }

   $stmt->bind_param("is", $teacherId, $classCode);
   if (!$stmt->execute()) {
       throw new Exception("Error inserting class: " . $stmt->error);
   }

   echo json_encode([
       "status" => "success",
       "message" => "Teacher account created",
       "teacherId" => $teacherId,
       "classCode" => $classCode
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
?>