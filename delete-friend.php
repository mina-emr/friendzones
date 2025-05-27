<?php
include '.config.php';

header('Content-Type: application/json');

// Get friend_id from either GET or POST
$data = json_decode(file_get_contents('php://input'), true);
$friend_id = $data['friend_id'] ?? $_GET['friend_id'] ?? 0;

// Validate friend_id
if (!is_numeric($friend_id) || $friend_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid friend ID']);
    exit;
}

try {
    // Prepare statement
    $stmt = $conn->prepare("DELETE FROM friends WHERE friend_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $friend_id);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    // Check if any row was actually deleted
    if ($stmt->affected_rows === 0) {
        throw new Exception("No friend found with that ID");
    }

    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    error_log("Delete error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>