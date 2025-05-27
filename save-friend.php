<?php
include '.config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$timezone = $data['timezone'];
$note = $data['note'] ?? '';

$stmt = $conn->prepare("INSERT INTO friends (name, timezone, note) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $timezone, $note);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'friend_id' => $stmt->insert_id,
        'created_at' => date('Y-m-d H:i:s')
    ]);

} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>