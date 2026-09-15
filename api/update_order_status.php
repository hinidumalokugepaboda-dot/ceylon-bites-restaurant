<?php
// ==========================================================
// Update Order Status Endpoint - Ceylon Bites & Sizzle
// POST: { order_id, new_status, estimated_prep_time?, kitchen_note?, rejection_reason? }
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

$orderId          = isset($data['order_id']) ? trim($data['order_id']) : '';
$newStatus        = isset($data['new_status']) ? trim($data['new_status']) : '';
$estimatedPrepTime = isset($data['estimated_prep_time']) ? intval($data['estimated_prep_time']) : null;
$kitchenNote      = isset($data['kitchen_note']) ? trim($data['kitchen_note']) : null;
$rejectionReason  = isset($data['rejection_reason']) ? trim($data['rejection_reason']) : null;
$cancellationReason = isset($data['cancellation_reason']) ? trim($data['cancellation_reason']) : null;

// Validate required fields
if (empty($orderId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Order ID is required.']);
    exit();
}

$allowedStatuses = ['pending', 'pending_reception', 'payment_pending', 'confirmed_reception', 'sent_to_kitchen', 'accepted', 'accepted_by_kitchen', 'preparing', 'ready', 'rejected', 'rejected_reception', 'rejected_kitchen', 'completed'];
if (!in_array($newStatus, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid order status: ' . $newStatus]);
    exit();
}

// Rejection requires a reason
if (($newStatus === 'rejected' || $newStatus === 'rejected_kitchen') && empty($rejectionReason)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A rejection reason is required when rejecting an order.']);
    exit();
}

if ($newStatus === 'rejected_reception' && empty($cancellationReason)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A cancellation reason is required when cancelling an order.']);
    exit();
}

// Acceptance should have a prep time
if (($newStatus === 'accepted' || $newStatus === 'accepted_by_kitchen') && empty($estimatedPrepTime)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'An estimated preparation time is required when accepting an order.']);
    exit();
}

try {
    // Fetch current order
    $checkStmt = $pdo->prepare("SELECT order_id, status FROM orders WHERE order_id = :order_id LIMIT 1");
    $checkStmt->execute([':order_id' => $orderId]);
    $order = $checkStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found.']);
        exit();
    }

    // Build update query dynamically
    $setClauses = ['status = :new_status', 'updated_at = CURRENT_TIMESTAMP'];
    $params = [':new_status' => $newStatus, ':order_id' => $orderId];

    if ($newStatus === 'accepted' || $newStatus === 'accepted_by_kitchen') {
        $setClauses[] = 'estimated_prep_time = :estimated_prep_time';
        $setClauses[] = 'accepted_at = CURRENT_TIMESTAMP';
        $params[':estimated_prep_time'] = $estimatedPrepTime;

        if (!empty($kitchenNote)) {
            $setClauses[] = 'kitchen_note = :kitchen_note';
            $params[':kitchen_note'] = $kitchenNote;
        }
    }

    if ($newStatus === 'rejected' || $newStatus === 'rejected_kitchen') {
        $setClauses[] = 'rejection_reason = :rejection_reason';
        $params[':rejection_reason'] = $rejectionReason;
    }

    if ($newStatus === 'rejected_reception') {
        $setClauses[] = 'cancellation_reason = :cancellation_reason';
        $params[':cancellation_reason'] = $cancellationReason;
        $setClauses[] = 'rejection_reason = :rejection_reason';
        $params[':rejection_reason'] = $cancellationReason;
    }

    $sql = 'UPDATE orders SET ' . implode(', ', $setClauses) . ' WHERE order_id = :order_id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Fetch updated order
    $fetchStmt = $pdo->prepare("SELECT * FROM orders WHERE order_id = :order_id LIMIT 1");
    $fetchStmt->execute([':order_id' => $orderId]);
    $updatedOrder = $fetchStmt->fetch();

    // Insert notification based on status
    $notifTitle = '';
    $notifMessage = '';
    $recipientType = '';
    $recipientId = 'all';
    $notificationType = '';

    if ($newStatus === 'confirmed_reception') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'RECEPTION_CONFIRMED';
        $notifTitle = 'Order Confirmed';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' has been confirmed by reception.';
    } elseif ($newStatus === 'rejected_reception') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'RECEPTION_CANCELLED';
        $notifTitle = 'Order Cancelled';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' has been cancelled. Reason: ' . $cancellationReason;
    } elseif ($newStatus === 'accepted_by_kitchen') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'KITCHEN_ACCEPTED';
        $notifTitle = 'Kitchen Accepted Order';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' is being prepared. Est. time: ' . $estimatedPrepTime . ' mins.';
    } elseif ($newStatus === 'rejected_kitchen') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'KITCHEN_REJECTED';
        $notifTitle = 'Kitchen Rejected Order';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' was rejected by the kitchen. Reason: ' . $rejectionReason;
    } elseif ($newStatus === 'preparing') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'ORDER_PREPARING';
        $notifTitle = 'Order Preparing';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' is now being prepared.';
    } elseif ($newStatus === 'ready') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'ORDER_READY';
        $notifTitle = 'Order Ready';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' is ready for serving/pickup!';
    } elseif ($newStatus === 'completed') {
        $recipientType = 'customer';
        $recipientId = $updatedOrder['customer_phone'];
        $notificationType = 'ORDER_COMPLETED';
        $notifTitle = 'Order Completed';
        $notifMessage = 'Your order #' . $updatedOrder['order_number'] . ' has been completed. Thank you!';
    }

    if ($newStatus === 'sent_to_kitchen') {
        // notification for kitchen
        $notifStmt = $pdo->prepare("
            INSERT INTO notifications (recipient_type, recipient_id, order_id, notification_type, title, message)
            VALUES ('kitchen', 'all', :order_id, 'NEW_ORDER_KITCHEN', :title, :message)
        ");
        $notifStmt->execute([
            ':order_id' => $orderId,
            ':title' => 'New Order for Kitchen',
            ':message' => 'Order #' . $updatedOrder['order_number'] . ' (Table ' . $updatedOrder['table_id'] . ') has been sent to the kitchen.'
        ]);

        // notification for customer
        $notifStmt = $pdo->prepare("
            INSERT INTO notifications (recipient_type, recipient_id, order_id, notification_type, title, message)
            VALUES ('customer', :recipient_id, :order_id, 'SENT_TO_KITCHEN', :title, :message)
        ");
        $notifStmt->execute([
            ':recipient_id' => $updatedOrder['customer_phone'],
            ':order_id' => $orderId,
            ':title' => 'Order Sent to Kitchen',
            ':message' => 'Your order #' . $updatedOrder['order_number'] . ' has been sent to the kitchen.'
        ]);
    } elseif ($notificationType !== '') {
        $notifStmt = $pdo->prepare("
            INSERT INTO notifications (recipient_type, recipient_id, order_id, notification_type, title, message)
            VALUES (:recipient_type, :recipient_id, :order_id, :notification_type, :title, :message)
        ");
        $notifStmt->execute([
            ':recipient_type' => $recipientType,
            ':recipient_id' => $recipientId,
            ':order_id' => $orderId,
            ':notification_type' => $notificationType,
            ':title' => $notifTitle,
            ':message' => $notifMessage
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Order status updated to: ' . $newStatus,
        'order'   => $updatedOrder
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update order status.'
    ]);
}
?>
