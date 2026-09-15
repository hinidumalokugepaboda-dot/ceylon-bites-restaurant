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

$recipientType = isset($data['recipient_type']) ? trim($data['recipient_type']) : '';
$recipientId = isset($data['recipient_id']) ? trim($data['recipient_id']) : null;
$orderId = isset($data['order_id']) ? trim($data['order_id']) : null;
$notificationType = isset($data['notification_type']) ? trim($data['notification_type']) : '';
$title = isset($data['title']) ? trim($data['title']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';
$reason = isset($data['reason']) ? trim($data['reason']) : null;

if (empty($recipientType) || empty($notificationType) || empty($title) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit();
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO notifications (recipient_type, recipient_id, order_id, notification_type, title, message, reason)
        VALUES (:recipient_type, :recipient_id, :order_id, :notification_type, :title, :message, :reason)
    ");
    $stmt->execute([
        ':recipient_type' => $recipientType,
        ':recipient_id' => $recipientId,
        ':order_id' => $orderId,
        ':notification_type' => $notificationType,
        ':title' => $title,
        ':message' => $message,
        ':reason' => $reason
    ]);

    $notificationId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Notification created successfully.',
        'notification_id' => $notificationId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create notification.'
    ]);
}
?>
