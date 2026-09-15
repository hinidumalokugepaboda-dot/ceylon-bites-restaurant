<?php
// ==========================================================
// Staff Login Endpoint - Ceylon Bites & Sizzle
// POST: { staff_code, password }
// Returns: { success, role, name, staff_id } on success
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

$staffCode = isset($data['staff_code']) ? trim($data['staff_code']) : '';
$password  = isset($data['password']) ? $data['password'] : '';

// Validate inputs
if (empty($staffCode)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Staff ID is required.']);
    exit();
}

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password is required.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT staff_id, staff_code, name, role, password_hash, active FROM staff WHERE staff_code = :staff_code LIMIT 1");
    $stmt->execute([':staff_code' => $staffCode]);
    $staff = $stmt->fetch();

    if (!$staff) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid Staff ID or password.']);
        exit();
    }

    if (!$staff['active']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'This staff account has been deactivated.']);
        exit();
    }

    if (!password_verify($password, $staff['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid Staff ID or password.']);
        exit();
    }

    // Success
    echo json_encode([
        'success'  => true,
        'staff_id' => $staff['staff_id'],
        'staff_code' => $staff['staff_code'],
        'name'     => $staff['name'],
        'role'     => $staff['role'],
        'message'  => 'Login successful.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Login failed. Please try again.'
    ]);
}
?>
