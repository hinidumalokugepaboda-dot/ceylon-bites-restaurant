<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use GET.']);
    exit();
}

$recipientType = isset($_GET['recipient_type']) ? trim($_GET['recipient_type']) : '';
$recipientId = isset($_GET['recipient_id']) ? trim($_GET['recipient_id']) : null;
$unreadOnly = isset($_GET['unread_only']) ? intval($_GET['unread_only']) : 0;
$orderId = isset($_GET['order_id']) ? trim($_GET['order_id']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

if (empty($recipientType)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'recipient_type is required.']);
    exit();
}

try {
    $query = "SELECT * FROM notifications WHERE recipient_type = :recipient_type";
    $params = [':recipient_type' => $recipientType];

    if ($recipientId !== null) {
        $query .= " AND (recipient_id = :recipient_id OR recipient_id = 'all')";
        $params[':recipient_id'] = $recipientId;
    } else {
        $query .= " AND recipient_id = 'all'";
    }

    if ($unreadOnly) {
        $query .= " AND is_read = 0";
    }

    if ($orderId !== null) {
        $query .= " AND order_id = :order_id";
        $params[':order_id'] = $orderId;
    }

    $query .= " ORDER BY created_at DESC LIMIT " . $limit;

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $notifications = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'notifications' => $notifications
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch notifications.'
    ]);
}
?>
