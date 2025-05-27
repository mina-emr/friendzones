<?php
include '.config.php';

header('Content-Type: application/json');

$result = $conn->query("SELECT friend_id, name, timezone, note FROM friends ORDER BY created_at DESC");

$friends = [];
while ($row = $result->fetch_assoc()) {
    $friends[] = $row;
}

echo json_encode($friends);

$conn->close();
?>