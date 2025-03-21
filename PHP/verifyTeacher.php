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
   $data = json_decode($input, true);

   if (!isset($data['email'])) {
       throw new Exception("Missing email");
   }

   $email = $data['email'];
   $randomPassword = bin2hex(random_bytes(8));
   $hashedPassword = password_hash($randomPassword, PASSWORD_DEFAULT);
   
	$stmt = $conn->prepare("SELECT teacherId FROM teachers WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $teacher = $result->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "teacherId" => $teacher['teacherId']
        ]);
    } else {
   // Insert teacher
   $stmt = $conn->prepare("INSERT INTO teachers (username, password) VALUES (?, ?)");
   $stmt->bind_param("ss", $email, $hashedPassword);
   
   if ($stmt->execute()) {
       echo json_encode([
           "status" => "success",
           "teacherId" => $conn->insert_id,
           "username" => $email,
           "password" => $randomPassword
       ]);
   } else {
       throw new Exception("Failed to create teacher account");
   }
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