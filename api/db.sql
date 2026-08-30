-- ==========================================================
-- Ceylon Bites & Sizzle - Restaurant Database Schema
-- Multi-tier Portion Sizing & Order Management Schema
-- Compatible with XAMPP MySQL / MariaDB (phpMyAdmin)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS ceylon_bites_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ceylon_bites_db;

-- ----------------------------------------------------------
-- 1. Table: menu_categories
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_categories (
    category_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. Table: menu_items
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
    item_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    spice_level VARCHAR(20) DEFAULT 'medium',
    vegetarian BOOLEAN DEFAULT FALSE,
    popular BOOLEAN DEFAULT FALSE,
    chef_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. Table: item_portions (Multi-tier S / M / L architecture)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_portions (
    portion_id VARCHAR(50) PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL,
    portion_name VARCHAR(50) NOT NULL, -- e.g., 'Small (S)', 'Medium (M)', 'Large (L)', 'Regular (R)'
    portion_code VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'R'
    price DECIMAL(10,2) NOT NULL,
    serves_count INT NOT NULL DEFAULT 1,
    description VARCHAR(255),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 4. Table: orders (Table Session & Dine-in/Takeaway Orders)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL,
    table_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    order_type ENUM('dine-in', 'takeaway') DEFAULT 'dine-in',
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'cash',
    status ENUM('received', 'accepted', 'preparing', 'ready', 'completed') DEFAULT 'received',
    special_notes TEXT,
    need_ice_bucket BOOLEAN DEFAULT FALSE,
    need_glassware BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 5. Table: order_items (Detailed Portioned Items in Order)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    portion_id VARCHAR(50) NOT NULL,
    portion_name VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    item_total DECIMAL(10,2) NOT NULL,
    spice_level VARCHAR(20),
    special_instructions TEXT,
    selected_addons JSON,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (portion_id) REFERENCES item_portions(portion_id)
) ENGINE=InnoDB;

-- ==========================================================
-- SEED DATA: Categories
-- ==========================================================
INSERT INTO menu_categories (category_id, name, description, display_order) VALUES
('kottu', 'Kottu', 'Chopped godamba roti tossed on sizzling iron plates', 1),
('devilled', 'Devilled', 'Sizzling sweet, spicy & caramelized Sri Lankan bites', 2),
('seafood', 'Seafood', 'Crispy cuttlefish, chilli garlic prawns & fresh catches', 3),
('fried-rice', 'Fried Rice', 'Wok-charred Sri Lankan style fragrant rice', 4),
('noodles', 'Noodles', 'Wok-tossed noodles with house chili paste & aromatics', 5),
('chicken-bites', 'Chicken & Bites', 'Crispy wings, loaded fries & finger bites for drinks', 6),
('sharing', 'Sharing Platters', 'Generous combination boards designed for the whole table', 7),
('desserts', 'Desserts', 'Authentic watalappam, molten lava cakes & puddings', 8),
('drinks', 'Non-Alcoholic Drinks', 'Fresh lime, chasers, ginger beer & tropical coolers', 9)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ==========================================================
-- SEED DATA: Base Items
-- ==========================================================
INSERT INTO menu_items (item_id, name, category_id, description, image, spice_level, vegetarian, popular, chef_special) VALUES
('kottu-chicken', 'Chicken Kottu', 'kottu', 'Chopped godamba roti stir-fried on sizzling iron with tender marinated chicken, egg, shredded cabbage, carrots, leeks, and roasted Ceylon spices.', '/assets/images/foods/chicken-kottu.jpg', 'spicy', FALSE, TRUE, TRUE),
('kottu-cheese-chicken', 'Cheese Chicken Kottu', 'kottu', 'Shredded chicken kottu blanketed with melted mozzarella and rich creamy cheese sauce.', '/assets/images/foods/cheese-chicken-kottu.jpg', 'medium', FALSE, TRUE, TRUE),
('devilled-chicken', 'Devilled Chicken', 'devilled', 'Crispy battered chicken chunks tossed with banana peppers, red onions, and sweet-spicy Ceylon glaze.', '/assets/images/foods/devilled-chicken.jpg', 'spicy', FALSE, TRUE, TRUE),
('seafood-hbc', 'Hot Butter Cuttlefish (HBC)', 'seafood', 'Crunchy batter-fried cuttlefish rings tossed in golden butter, crushed dried red chili, and garlic flakes.', '/assets/images/foods/hot-butter-cuttlefish.jpg', 'spicy', FALSE, TRUE, TRUE),
('rice-chicken', 'Chicken Fried Rice', 'fried-rice', 'Fluffy basmati rice wok-tossed over high flame with spiced shredded chicken, scrambled eggs, and chili paste.', '/assets/images/foods/chicken-fried-rice.jpg', 'medium', FALSE, TRUE, FALSE),
('drink-fresh-lime', 'Fresh Lime Juice & Soda', 'drinks', 'Freshly squeezed Ceylon green limes with mint, cane sugar, and chilled sparkling soda.', '/assets/images/foods/fresh-lime.jpg', 'mild', TRUE, TRUE, FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ==========================================================
-- SEED DATA: Multi-Tier Portion Sizes
-- ==========================================================
INSERT INTO item_portions (portion_id, item_id, portion_name, portion_code, price, serves_count, description) VALUES
-- Chicken Kottu
('kottu-chicken-portion-s', 'kottu-chicken', 'Small (S)', 'S', 950.00, 1, 'Single Serving (Serves 1)'),
('kottu-chicken-portion-m', 'kottu-chicken', 'Medium (M)', 'M', 1650.00, 2, 'Standard 2-Person Sharing'),
('kottu-chicken-portion-l', 'kottu-chicken', 'Large (L)', 'L', 2400.00, 3, 'Family / Group Portion (Serves 3-4)'),

-- Cheese Chicken Kottu
('kottu-cheese-chicken-portion-s', 'kottu-cheese-chicken', 'Small (S)', 'S', 1250.00, 1, 'Single Serving (Serves 1)'),
('kottu-cheese-chicken-portion-m', 'kottu-cheese-chicken', 'Medium (M)', 'M', 2200.00, 2, 'Standard 2-Person Sharing'),
('kottu-cheese-chicken-portion-l', 'kottu-cheese-chicken', 'Large (L)', 'L', 3150.00, 3, 'Family / Group Portion (Serves 3-4)'),

-- Devilled Chicken
('devilled-chicken-portion-s', 'devilled-chicken', 'Small (S)', 'S', 850.00, 1, 'Single Bite (Serves 1)'),
('devilled-chicken-portion-m', 'devilled-chicken', 'Medium (M)', 'M', 1500.00, 2, 'Sharing Bite (Serves 2)'),
('devilled-chicken-portion-l', 'devilled-chicken', 'Large (L)', 'L', 2150.00, 3, 'Group Sizzle Plate (Serves 3)'),

-- Hot Butter Cuttlefish
('seafood-hbc-portion-s', 'seafood-hbc', 'Small (S)', 'S', 1400.00, 1, 'Single Serving (Serves 1)'),
('seafood-hbc-portion-m', 'seafood-hbc', 'Medium (M)', 'M', 2450.00, 2, 'Standard Sharing Plate (Serves 2)'),
('seafood-hbc-portion-l', 'seafood-hbc', 'Large (L)', 'L', 3500.00, 3, 'Party Board Portion (Serves 3-4)'),

-- Chicken Fried Rice
('rice-chicken-portion-s', 'rice-chicken', 'Small (S)', 'S', 900.00, 1, 'Single Bowl (Serves 1)'),
('rice-chicken-portion-m', 'rice-chicken', 'Medium (M)', 'M', 1600.00, 2, 'Standard 2-Person Bowl'),
('rice-chicken-portion-l', 'rice-chicken', 'Large (L)', 'L', 2250.00, 3, 'Family Platter (Serves 3-4)'),

-- Fresh Lime Soda
('drink-fresh-lime-portion-r', 'drink-fresh-lime', 'Regular (R)', 'R', 250.00, 1, 'Tall Chilled Glass (350ml)')
ON DUPLICATE KEY UPDATE price=VALUES(price);
