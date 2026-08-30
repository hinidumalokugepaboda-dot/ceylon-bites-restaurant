<?php
// ==========================================================
// Place Order Endpoint - Ceylon Bites & Sizzle
// Handles Table Session, Portioned Items & Inserts to Database
// ==========================================================

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

// Extract payload fields
$orderId = !empty($data['order_id']) ? $data['order_id'] : 'ord-' . uniqid();
$orderNumber = !empty($data['order_number']) ? $data['order_number'] : (string)rand(1000, 9999);
$tableId = !empty($data['table_id']) ? $data['table_id'] : '12';
$customerName = !empty($data['customer_name']) ? $data['customer_name'] : 'Valued Guest';
$customerPhone = !empty($data['customer_phone']) ? $data['customer_phone'] : '077 000 0000';
$orderType = !empty($data['order_type']) ? $data['order_type'] : 'dine-in';
$subtotal = isset($data['subtotal']) ? floatval($data['subtotal']) : 0.00;
$discount = isset($data['discount']) ? floatval($data['discount']) : 0.00;
$totalAmount = isset($data['total_amount']) ? floatval($data['total_amount']) : ($subtotal - $discount);
$paymentMethod = !empty($data['payment_method']) ? $data['payment_method'] : 'cash';
$specialNotes = !empty($data['special_notes']) ? $data['special_notes'] : '';
$needIceBucket = !empty($data['need_ice_bucket']) ? 1 : 0;
$needGlassware = !empty($data['need_glassware']) ? 1 : 0;
$items = !empty($data['items']) && is_array($data['items']) ? $data['items'] : [];

if (empty($items)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Cannot place an empty order.']);
    exit();
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // 1. Insert into orders table
    $stmtOrder = $pdo->prepare("
        INSERT INTO orders (
            order_id, order_number, table_id, customer_name, customer_phone,
            order_type, subtotal, discount, total_amount, payment_method,
            status, special_notes, need_ice_bucket, need_glassware
        ) VALUES (
            :order_id, :order_number, :table_id, :customer_name, :customer_phone,
            :order_type, :subtotal, :discount, :total_amount, :payment_method,
            'received', :special_notes, :need_ice_bucket, :need_glassware
        )
    ");

    $stmtOrder->execute([
        ':order_id' => $orderId,
        ':order_number' => $orderNumber,
        ':table_id' => $tableId,
        ':customer_name' => $customerName,
        ':customer_phone' => $customerPhone,
        ':order_type' => $orderType,
        ':subtotal' => $subtotal,
        ':discount' => $discount,
        ':total_amount' => $totalAmount,
        ':payment_method' => $paymentMethod,
        ':special_notes' => $specialNotes,
        ':need_ice_bucket' => $needIceBucket,
        ':need_glassware' => $needGlassware
    ]);

    // 2. Insert line items with portion IDs into order_items table
    $stmtItem = $pdo->prepare("
        INSERT INTO order_items (
            order_id, item_id, portion_id, portion_name, quantity,
            unit_price, item_total, spice_level, special_instructions, selected_addons
        ) VALUES (
            :order_id, :item_id, :portion_id, :portion_name, :quantity,
            :unit_price, :item_total, :spice_level, :special_instructions, :selected_addons
        )
    ");

    foreach ($items as $item) {
        $itemId = !empty($item['item_id']) ? $item['item_id'] : 'unknown';
        $portionId = !empty($item['portion_id']) ? $item['portion_id'] : $itemId . '-portion-s';
        $portionName = !empty($item['portion_name']) ? $item['portion_name'] : 'Small (S)';
        $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
        $unitPrice = isset($item['unit_price']) ? floatval($item['unit_price']) : 0.00;
        $itemTotal = isset($item['item_total']) ? floatval($item['item_total']) : ($unitPrice * $quantity);
        $spiceLevel = !empty($item['spice_level']) ? $item['spice_level'] : 'medium';
        $specialInstructions = !empty($item['special_instructions']) ? $item['special_instructions'] : '';
        $selectedAddons = !empty($item['selected_addons']) ? json_encode($item['selected_addons']) : null;

        $stmtItem->execute([
            ':order_id' => $orderId,
            ':item_id' => $itemId,
            ':portion_id' => $portionId,
            ':portion_name' => $portionName,
            ':quantity' => $quantity,
            ':unit_price' => $unitPrice,
            ':item_total' => $itemTotal,
            ':spice_level' => $spiceLevel,
            ':special_instructions' => $specialInstructions,
            ':selected_addons' => $selectedAddons
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order successfully placed and recorded in database.',
        'order' => [
            'order_id' => $orderId,
            'order_number' => $orderNumber,
            'table_id' => $tableId,
            'status' => 'received',
            'total_amount' => $totalAmount,
            'items_count' => count($items)
        ]
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to record order: ' . $e->getMessage()
    ]);
}
?>
