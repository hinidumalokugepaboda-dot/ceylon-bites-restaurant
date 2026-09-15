<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit();
}

$notificationId = isset($data['notification_id']) ? intval($data['notification_id']) : null;
$recipientType = isset($data['recipient_type']) ? trim($data['recipient_type']) : null;
$recipientId = isset($data['recipient_id']) ? trim($data['recipient_id']) : null;

if (empty($notificationId) && empty($recipientType)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Provide either notification_id or recipient_type.']);
    exit();
}

try {
    if (!empty($notificationId)) {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE notification_id = :notification_id");
        $stmt->execute([':notification_id' => $notificationId]);
    } else {
        $query = "UPDATE notifications SET is_read = 1 WHERE recipient_type = :recipient_type";
        $params = [':recipient_type' => $recipientType];
        
        if (!empty($recipientId)) {
            $query .= " AND recipient_id = :recipient_id";
            $params[':recipient_id'] = $recipientId;
        }
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Notification(s) marked as read.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to mark notification(s) as read.'
    ]);
}
?>
