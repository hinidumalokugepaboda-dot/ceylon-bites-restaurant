-- ==========================================================
-- Ceylon Bites & Sizzle - Extended Database Schema
-- Run this AFTER the base db.sql to add staff login
-- and enhanced order management columns.
-- ==========================================================

USE ceylon_bites_db;

-- ----------------------------------------------------------
-- 6. Table: staff (Admin & Kitchen Staff accounts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL UNIQUE,   -- e.g. ADMIN001, KIT001
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'reception', 'kitchen') NOT NULL DEFAULT 'kitchen',
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Alter orders table to support extended order lifecycle
-- ----------------------------------------------------------

-- Add estimated_prep_time (minutes set by kitchen on accept)
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS estimated_prep_time INT DEFAULT NULL AFTER updated_at;

-- Add kitchen note (optional message from kitchen to customer on accept)
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS kitchen_note TEXT DEFAULT NULL AFTER estimated_prep_time;

-- Add rejection_reason (required when kitchen rejects)
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL AFTER kitchen_note;

-- Add accepted_at timestamp
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP NULL DEFAULT NULL AFTER rejection_reason;

-- Extend status ENUM to include 'pending' and 'rejected'
-- NOTE: In MySQL you must re-define the full ENUM
ALTER TABLE orders
    MODIFY COLUMN status ENUM('pending','pending_reception','payment_pending','received','confirmed_reception','sent_to_kitchen','accepted','accepted_by_kitchen','preparing','ready','rejected','rejected_reception','rejected_kitchen','completed')
    DEFAULT 'pending_reception';

-- Add payment_status column
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_status ENUM('pending','confirmed','failed') DEFAULT 'pending' AFTER status;

-- ----------------------------------------------------------
-- SEED DATA: Demo Staff Accounts
-- Passwords hashed with PHP password_hash($pass, PASSWORD_DEFAULT)
-- admin123  => $2y$10$generated_hash_for_admin
-- kitchen123 => $2y$10$generated_hash_for_kitchen
-- We store the plaintext-equivalent hash generated externally.
-- For demo, we use password_hash('admin123') and password_hash('kitchen123')
-- ----------------------------------------------------------
INSERT INTO staff (staff_code, name, role, password_hash) VALUES
(
    'ADMIN001',
    'Saman Perera',
    'admin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    -- This is the bcrypt hash of 'password' — replace with real hash for production
    -- Use PHP: echo password_hash('admin123', PASSWORD_DEFAULT);
),
(
    'KIT001',
    'Nimal Kumara',
    'kitchen',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    -- Same placeholder — replace with real hash for production
),
(
    'REC001',
    'Dilini Fernando',
    'reception',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ----------------------------------------------------------
-- NOTE: The above hashes are placeholders.
-- Run this PHP snippet in XAMPP to generate real hashes:
--
-- <?php
--   echo password_hash('admin123', PASSWORD_DEFAULT);  // for ADMIN001
--   echo "\n";
--   echo password_hash('kitchen123', PASSWORD_DEFAULT); // for KIT001
-- ?>
--
-- Then UPDATE staff SET password_hash = '<new_hash>' WHERE staff_code = 'ADMIN001';
-- ----------------------------------------------------------
