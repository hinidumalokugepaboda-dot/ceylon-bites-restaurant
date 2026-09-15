USE ceylon_bites_db;

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type ENUM('customer','reception','kitchen','admin') NOT NULL,
    recipient_id VARCHAR(100) DEFAULT NULL,
    order_id VARCHAR(50) DEFAULT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reason TEXT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_order (order_id),
    INDEX idx_unread (recipient_type, is_read)
) ENGINE=InnoDB;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT DEFAULT NULL AFTER rejection_reason;
