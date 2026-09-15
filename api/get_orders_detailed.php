<?php
// ==========================================================
// Get Detailed Orders Endpoint - Ceylon Bites & Sizzle
// GET: ?status=pending|accepted|... (optional filter)
// Returns full orders with JSON array of order_items
// ==========================================================

require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use GET.']);
    exit();
}

$statusFilter = isset($_GET['status']) ? trim($_GET['status']) : null;
$allowedStatuses = [
    'pending',
    'pending_reception',
    'payment_pending',
    'received',
    'confirmed_reception',
    'sent_to_kitchen',
    'accepted',
    'accepted_by_kitchen',
    'preparing',
    'ready',
    'rejected',
    'rejected_reception',
    'rejected_kitchen',
    'completed'
];

try {
    // Build base query for orders
    if ($statusFilter && in_array($statusFilter, $allowedStatuses)) {
        $orderStmt = $pdo->prepare("
            SELECT * FROM orders
            WHERE status = :status
            ORDER BY created_at DESC
        ");
        $orderStmt->execute([':status' => $statusFilter]);
    } else {
        $orderStmt = $pdo->query("
            SELECT * FROM orders
            ORDER BY created_at DESC
            LIMIT 100
        ");
    }

    $orders = $orderStmt->fetchAll();

    // For each order, fetch its line items with menu item names
    $itemStmt = $pdo->prepare("
        SELECT
            oi.*,
            m.name AS item_name,
            m.image AS item_image
        FROM order_items oi
        LEFT JOIN menu_items m ON oi.item_id = m.item_id
        WHERE oi.order_id = :order_id
        ORDER BY oi.order_item_id ASC
    ");

    foreach ($orders as &$order) {
        $itemStmt->execute([':order_id' => $order['order_id']]);
        $order['items'] = $itemStmt->fetchAll();

        // Parse selected_addons JSON
        foreach ($order['items'] as &$item) {
            if (!empty($item['selected_addons'])) {
                $item['selected_addons'] = json_decode($item['selected_addons'], true) ?: [];
            } else {
                $item['selected_addons'] = [];
            }
        }
    }

    echo json_encode([
        'success' => true,
        'count'   => count($orders),
        'orders'  => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch orders.'
    ]);
}
?>
