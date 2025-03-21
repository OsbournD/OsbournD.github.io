<?php
header('Content-Type: application/json');

try {
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

   if (!isset($data['teacherId'])) {
       throw new Exception("Teacher ID is required");
   }

   $teacherId = $data['teacherId'];

   // Get class info
   $sql = "SELECT classCode FROM classes WHERE teacherId = ?";
   $stmt = $conn->prepare($sql);
   $stmt->bind_param("i", $teacherId);
   $stmt->execute();
   $result = $stmt->get_result();
   $classInfo = $result->fetch_assoc();
   $stmt->close();

   // Get student data
   $sql = "SELECT u.display_name as username, 
           MAX(s.score) as highScore,
           COUNT(DISTINCT s.level) as levelsCompleted,
           MAX(s.timestamp) as lastActive
           FROM users u 
           LEFT JOIN scores s ON u.UserID = s.UserID
           WHERE u.class_code IN (SELECT classCode FROM classes WHERE teacherId = ?)
           GROUP BY u.UserID";
           
   $stmt = $conn->prepare($sql);
   $stmt->bind_param("i", $teacherId);
   $stmt->execute();
   $result = $stmt->get_result();
   
   $students = [];
   $totalScore = 0;
   $studentCount = 0;
   
   while($row = $result->fetch_assoc()) {
       $students[] = [
           'username' => $row['username'],
           'highScore' => $row['highScore'] ?? 0,
           'levelsCompleted' => $row['levelsCompleted'] ?? 0,
           'lastActive' => $row['lastActive'] ?? 'Never'
       ];
       $totalScore += $row['highScore'] ?? 0;
       $studentCount++;
   }

   $averageScore = $studentCount > 0 ? round($totalScore / $studentCount) : 0;

   echo json_encode([
       "status" => "success",
       "classCode" => $classInfo['classCode'],
       "totalStudents" => $studentCount,
       "averageScore" => $averageScore,
       "students" => $students
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