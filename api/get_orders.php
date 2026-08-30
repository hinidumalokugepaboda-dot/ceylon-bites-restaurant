<?php
// ==========================================================
// Get Orders Endpoint (Kitchen / Admin View)
// ==========================================================

require_once 'db_connect.php';

header('Content-Type: application/json');

try {
    // Fetch orders with order items joined
    $stmt = $pdo->query("
        SELECT 
            o.*,
            GROUP_CONCAT(
                CONCAT(
                    oi.quantity, 'x ', 
                    m.name, ' (', oi.portion_name, ')'
                ) SEPARATOR ', '
            ) AS items_summary
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN menu_items m ON oi.item_id = m.item_id
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
    ");

    $orders = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'count' => count($orders),
        'orders' => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch orders: ' . $e->getMessage()
    ]);
}
?>
