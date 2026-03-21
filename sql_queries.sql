-- ============================================================
--  discokart – Discount & Coupon Database
--  SQL Queries (MySQL / SQLite Compatible)
-- ============================================================

-- ============================================================
-- SECTION 1: DDL – CREATE TABLES
-- ============================================================

-- 1.1 Users Table
CREATE TABLE IF NOT EXISTS users (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('admin','customer') NOT NULL DEFAULT 'customer',
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id              INT           PRIMARY KEY AUTO_INCREMENT,
    code            VARCHAR(50)   NOT NULL UNIQUE,
    description     VARCHAR(255)  NOT NULL,
    discount_type   ENUM('percentage','fixed') NOT NULL,
    discount_value  DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    min_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    valid_from      DATE          NOT NULL,
    valid_until     DATE          NOT NULL,
    usage_limit     INT           NOT NULL DEFAULT 1,
    usage_count     INT           NOT NULL DEFAULT 0,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_percentage CHECK (
        discount_type != 'percentage' OR discount_value <= 100
    ),
    CONSTRAINT chk_dates CHECK (valid_until >= valid_from)
);

-- 1.3 Redemption History Table
CREATE TABLE IF NOT EXISTS redemptions (
    id              INT           PRIMARY KEY AUTO_INCREMENT,
    coupon_id       INT           NOT NULL,
    user_id         INT           NOT NULL,
    order_value     DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    final_amount    DECIMAL(10,2) NOT NULL,
    redeemed_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);

-- 1.4 Products Table
CREATE TABLE IF NOT EXISTS products (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(150)  NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    category    VARCHAR(50)   NOT NULL,
    emoji       VARCHAR(10),
    rating      DECIMAL(3,1)  DEFAULT 0.0,
    reviews     INT           DEFAULT 0,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- SECTION 2: DML – INSERT (SEED DATA)
-- ============================================================

-- 2.1 Insert Users (Admins and Customers)
INSERT INTO users (name, email, password, role) VALUES
('Admin User',       'admin@test.com',       '$2a$10$hashedpassword1', 'admin'),
('System Admin',     'sysadmin@test.com',    '$2a$10$hashedpassword1', 'admin'),
('Siva Kumar',       'siva@test.com',        '$2a$10$hashedpassword2', 'customer'),
('Priya S',          'priya@test.com',       '$2a$10$hashedpassword3', 'customer'),
('Ravi K',           'ravi@test.com',        '$2a$10$hashedpassword4', 'customer'),
('Karthik Raja',     'karthik@test.com',     '$2a$10$hashedpassword5', 'customer'),
('Deepa N',          'deepa@test.com',       '$2a$10$hashedpassword6', 'customer'),
('Aravind M',        'aravind@test.com',     '$2a$10$hashedpassword7', 'customer'),
('Meena V',          'meena@test.com',       '$2a$10$hashedpassword8', 'customer'),
('Vijay P',          'vijay@test.com',       '$2a$10$hashedpassword9', 'customer'),
('Anitha R',         'anitha@test.com',      '$2a$10$hashedpass10',    'customer'),
('Suresh G',         'suresh@test.com',      '$2a$10$hashedpass11',    'customer');

-- 2.2 Insert Sample Coupons
INSERT INTO coupons
    (code, description, discount_type, discount_value, min_order_value, valid_from, valid_until, usage_limit, usage_count, is_active)
VALUES
    ('SAVE20',     'Get 20% off on all items',              'percentage', 20,   500,  '2026-01-01', '2026-12-31', 100, 5,   TRUE),
    ('FLAT150',    'Flat ₹150 off on orders above ₹999',   'fixed',      150,  999,  '2026-01-01', '2026-06-30', 50,  2,   TRUE),
    ('WELCOME10',  '10% off for new customers',             'percentage', 10,   0,    '2026-01-01', '2026-12-31', 200, 3,   TRUE),
    ('SUMMER30',   '30% Summer Sale discount',              'percentage', 30,   1000, '2026-04-01', '2026-06-30', 75,  0,   TRUE),
    ('FLASH500',   '₹500 flat discount on premium orders',  'fixed',      500,  2500, '2026-03-01', '2026-03-31', 20,  1,   TRUE),
    ('DISWALI50',  'Diwali Dhamaka 50% Off',                'percentage', 50,   2000, '2026-10-01', '2026-11-15', 500, 0,   TRUE),
    ('TechFest25', '25% Off on Electronics',                'percentage', 25,   1500, '2026-02-01', '2026-04-30', 100, 2,   TRUE),
    ('FLAT50',     '₹50 off on small orders',               'fixed',      50,   200,  '2026-01-01', '2026-12-31', 1000,10,  TRUE),
    ('MONSOON15',  '15% off during rainy season',           'percentage', 15,   600,  '2026-07-01', '2026-09-30', 200, 0,   TRUE),
    ('EXPIRED100', 'Old ₹100 flat discount',                'fixed',      100,  500,  '2025-01-01', '2025-12-31', 100, 100, FALSE);

-- 2.3 Insert Sample Redemption History
INSERT INTO redemptions (coupon_id, user_id, order_value, discount_amount, final_amount, redeemed_at) VALUES
(1, 3, 1000.00,  200.00,  800.00,   '2026-01-15 10:30:00'),
(3, 4, 500.00,   50.00,   450.00,   '2026-01-16 11:45:00'),
(1, 5, 1500.00,  300.00,  1200.00,  '2026-01-20 09:15:00'),
(2, 3, 1200.00,  150.00,  1050.00,  '2026-02-05 14:20:00'),
(7, 6, 2000.00,  500.00,  1500.00,  '2026-02-10 16:00:00'),
(8, 7, 350.00,   50.00,   300.00,   '2026-02-15 18:30:00'),
(1, 8, 800.00,   160.00,  640.00,   '2026-02-20 12:10:00'),
(5, 9, 3000.00,  500.00,  2500.00,  '2026-03-05 08:30:00'),
(1, 10, 600.00,  120.00,  480.00,   '2026-03-10 20:45:00'),
(3, 11, 400.00,  40.00,   360.00,   '2026-03-12 21:00:00'),
(8, 12, 250.00,  50.00,   200.00,   '2026-03-14 15:50:00'),
(2, 4, 1800.00,  150.00,  1650.00,  '2026-03-15 10:05:00'),
(1, 6, 2200.00,  440.00,  1760.00,  '2026-03-18 19:25:00'),
(7, 8, 1600.00,  400.00,  1200.00,  '2026-03-20 13:40:00');

-- 2.4 Insert Sample Products
INSERT INTO products (name, price, category, emoji, rating, reviews) VALUES
('Wireless Headphones Pro', 1499.00, 'Electronics', '🎧', 4.5, 128),
('Mechanical Keyboard RGB', 2999.00, 'Electronics', '⌨️', 4.7, 86),
('Casual T-Shirt (Blue)',   499.00,  'Clothing',    '👕', 4.2, 214),
('Running Shoes V2',        1999.00, 'Footwear',    '👟', 4.6, 183),
('Coffee Mug (Ceramic)',    349.00,  'Kitchen',     '☕', 4.8, 302),
('Travel Backpack',         1299.00, 'Accessories', '🎒', 4.4, 95),
('Aviator Sunglasses',      799.00,  'Accessories', '🕶️', 4.3, 67),
('Steel Water Bottle',      599.00,  'Kitchen',     '🍶', 4.6, 421),
('Bluetooth Speaker Mini',  2499.00, 'Electronics', '🔊', 4.5, 158),
('LED Desk Lamp',           899.00,  'Furniture',   '💡', 4.4, 77),
('Yoga Mat (Non-slip)',     699.00,  'Sports',      '🧘', 4.7, 199),
('Notebook Set 3-Pack',     249.00,  'Stationery',  '📓', 4.5, 342),
('Gaming Mouse',            1299.00, 'Electronics', '🖱️', 4.8, 310),
('Smart Watch Series 5',    4999.00, 'Electronics', '⌚', 4.6, 450),
('Cotton Jeans',            1199.00, 'Clothing',    '👖', 4.1, 150),
('Leather Wallet',          850.00,  'Accessories', '👛', 4.5, 80),
('Protein Shaker',          299.00,  'Sports',      '🥤', 4.3, 210),
('Office Chair Ergonomic',  6500.00, 'Furniture',   '🪑', 4.7, 115),
('Smartphone Stand',        199.00,  'Accessories', '📱', 4.2, 88),
('Dumbbell Set (5kg)',      1500.00, 'Sports',      '🏋️', 4.8, 520);


-- ============================================================
-- SECTION 3: SELECT – BASIC QUERIES
-- ============================================================

-- 3.1 View all coupons
SELECT * FROM coupons;

-- 3.2 View all active coupons
SELECT * FROM coupons
WHERE is_active = TRUE;

-- 3.3 View all users (excluding passwords)
SELECT id, name, email, role, created_at FROM users;

-- 3.4 View only admin users
SELECT id, name, email FROM users WHERE role = 'admin';

-- 3.5 View all coupons sorted by creation date (newest first)
SELECT * FROM coupons ORDER BY created_at DESC;

-- 3.6 View only percentage-type coupons
SELECT code, description, discount_value
FROM coupons
WHERE discount_type = 'percentage';

-- 3.7 View only fixed-amount coupons
SELECT code, description, discount_value
FROM coupons
WHERE discount_type = 'fixed';

-- 3.8 View all products
SELECT * FROM products;

-- 3.9 View products by category
SELECT * FROM products WHERE category = 'Electronics';


-- ============================================================
-- SECTION 4: SELECT – FILTER & SEARCH QUERIES
-- ============================================================

-- 4.1 Find a coupon by code
SELECT * FROM coupons WHERE code = 'SAVE20';

-- 4.2 Search coupons by keyword in description
SELECT * FROM coupons WHERE description LIKE '%off%';

-- 4.3 Coupons currently valid (not expired, not future)
SELECT * FROM coupons
WHERE is_active = TRUE
  AND valid_from  <= CURDATE()
  AND valid_until >= CURDATE();

-- 4.4 Coupons expiring in the next 7 days
SELECT code, description, valid_until
FROM coupons
WHERE is_active = TRUE
  AND valid_until BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);

-- 4.5 Coupons that are fully exhausted (usage_count >= usage_limit)
SELECT code, usage_count, usage_limit
FROM coupons
WHERE usage_count >= usage_limit;

-- 4.6 Coupons with at least 50% usage remaining
SELECT code, usage_count, usage_limit,
       ROUND((usage_count / usage_limit) * 100, 1) AS usage_percent
FROM coupons
WHERE usage_count < usage_limit * 0.5;

-- 4.7 Coupons valid for order value of ₹1000
SELECT * FROM coupons
WHERE is_active = TRUE
  AND min_order_value <= 1000
  AND valid_from  <= CURDATE()
  AND valid_until >= CURDATE()
  AND usage_count < usage_limit;


-- ============================================================
-- SECTION 5: SELECT – AGGREGATE & GROUP BY QUERIES
-- ============================================================

-- 5.1 Total number of coupons
SELECT COUNT(*) AS total_coupons FROM coupons;

-- 5.2 Count of active vs inactive coupons
SELECT is_active, COUNT(*) AS count
FROM coupons
GROUP BY is_active;

-- 5.3 Count of coupons by type
SELECT discount_type, COUNT(*) AS count
FROM coupons
GROUP BY discount_type;

-- 5.4 Total redemptions across all coupons
SELECT SUM(usage_count) AS total_redemptions FROM coupons;

-- 5.5 Average discount value per type
SELECT discount_type,
       ROUND(AVG(discount_value), 2) AS avg_discount
FROM coupons
GROUP BY discount_type;

-- 5.6 Most redeemed coupon
SELECT code, description, usage_count
FROM coupons
ORDER BY usage_count DESC
LIMIT 1;

-- 5.7 Top 3 most redeemed coupons
SELECT code, description, usage_count, usage_limit
FROM coupons
ORDER BY usage_count DESC
LIMIT 3;

-- 5.8 Total discount given per coupon (from redemption history)
SELECT c.code, c.description,
       COUNT(r.id)              AS times_redeemed,
       SUM(r.discount_amount)   AS total_discount_given,
       SUM(r.final_amount)      AS total_revenue
FROM coupons c
LEFT JOIN redemptions r ON r.coupon_id = c.id
GROUP BY c.id, c.code, c.description
ORDER BY total_discount_given DESC;

-- 5.9 Total savings by each customer
SELECT u.name, u.email,
       COUNT(r.id)            AS redemptions,
       SUM(r.discount_amount) AS total_saved
FROM users u
JOIN redemptions r ON r.user_id = u.id
WHERE u.role = 'customer'
GROUP BY u.id, u.name, u.email
ORDER BY total_saved DESC;

-- 5.10 Count of customers and admins
SELECT role, COUNT(*) AS count
FROM users
GROUP BY role;


-- ============================================================
-- SECTION 6: SELECT – JOIN QUERIES
-- ============================================================

-- 6.1 Full redemption history with user and coupon details
SELECT
    r.id,
    u.name        AS customer_name,
    u.email       AS customer_email,
    c.code        AS coupon_code,
    c.discount_type,
    c.discount_value,
    r.order_value,
    r.discount_amount,
    r.final_amount,
    r.redeemed_at
FROM redemptions r
JOIN users   u ON u.id = r.user_id
JOIN coupons c ON c.id = r.coupon_id
ORDER BY r.redeemed_at DESC;

-- 6.2 Which coupons have never been redeemed?
SELECT c.code, c.description, c.usage_count
FROM coupons c
LEFT JOIN redemptions r ON r.coupon_id = c.id
WHERE r.id IS NULL;

-- 6.3 Redemption history for a specific customer
SELECT c.code, r.order_value, r.discount_amount, r.final_amount, r.redeemed_at
FROM redemptions r
JOIN coupons c ON c.id = r.coupon_id
WHERE r.user_id = 2
ORDER BY r.redeemed_at DESC;

-- 6.4 All coupons a specific customer has used
SELECT DISTINCT c.code, c.description
FROM coupons c
JOIN redemptions r ON r.coupon_id = c.id
WHERE r.user_id = 2;


-- ============================================================
-- SECTION 7: SELECT – SUBQUERIES
-- ============================================================

-- 7.1 Coupons with above-average usage count (subquery)
SELECT code, usage_count
FROM coupons
WHERE usage_count > (SELECT AVG(usage_count) FROM coupons);

-- 7.2 Customer who saved the most money (subquery)
SELECT name, email FROM users
WHERE id = (
    SELECT user_id
    FROM redemptions
    GROUP BY user_id
    ORDER BY SUM(discount_amount) DESC
    LIMIT 1
);

-- 7.3 Coupons not yet used by customer ID 2
SELECT code, description FROM coupons
WHERE id NOT IN (
    SELECT coupon_id FROM redemptions WHERE user_id = 2
)
AND is_active = TRUE;


-- ============================================================
-- SECTION 8: DML – UPDATE QUERIES
-- ============================================================

-- 8.1 Deactivate a coupon by code
UPDATE coupons
SET is_active = FALSE
WHERE code = 'FLASH500';

-- 8.2 Activate a coupon
UPDATE coupons
SET is_active = TRUE
WHERE code = 'FLASH500';

-- 8.3 Increment usage count when a coupon is redeemed
UPDATE coupons
SET usage_count = usage_count + 1
WHERE code = 'SAVE20';

-- 8.4 Update coupon expiry date
UPDATE coupons
SET valid_until = '2026-09-30'
WHERE code = 'SUMMER30';

-- 8.5 Extend all active coupons by 30 days
UPDATE coupons
SET valid_until = DATE_ADD(valid_until, INTERVAL 30 DAY)
WHERE is_active = TRUE;

-- 8.6 Change discount value
UPDATE coupons
SET discount_value = 25
WHERE code = 'SAVE20';

-- 8.7 Update user name
UPDATE users
SET name = 'Admin Super'
WHERE email = 'admin@test.com';

-- 8.8 Deactivate all expired coupons (batch)
UPDATE coupons
SET is_active = FALSE
WHERE valid_until < CURDATE()
  AND is_active = TRUE;


-- ============================================================
-- SECTION 9: DML – DELETE QUERIES
-- ============================================================

-- 9.1 Delete a specific coupon by code
DELETE FROM coupons WHERE code = 'FLAT150';

-- 9.2 Delete all expired AND inactive coupons
DELETE FROM coupons
WHERE valid_until < CURDATE()
  AND is_active = FALSE;

-- 9.3 Delete all redemptions for a specific coupon
DELETE FROM redemptions WHERE coupon_id = 1;

-- 9.4 Delete a user account
DELETE FROM users WHERE email = 'ravi@test.com';

-- 9.5 Delete all exhausted coupons (usage_count >= usage_limit)
DELETE FROM coupons
WHERE usage_count >= usage_limit;


-- ============================================================
-- SECTION 10: VIEWS
-- ============================================================

-- 10.1 View: Active Valid Coupons (for customer portal)
CREATE OR REPLACE VIEW active_coupons AS
SELECT id, code, description, discount_type, discount_value,
       min_order_value, valid_from, valid_until, usage_limit, usage_count
FROM coupons
WHERE is_active = TRUE
  AND valid_from  <= CURDATE()
  AND valid_until >= CURDATE()
  AND usage_count < usage_limit;

-- Query the view
SELECT * FROM active_coupons;

-- 10.2 View: Coupon Usage Summary (for admin dashboard)
CREATE OR REPLACE VIEW coupon_summary AS
SELECT
    c.id, c.code, c.description, c.discount_type, c.discount_value,
    c.usage_count, c.usage_limit,
    ROUND((c.usage_count / c.usage_limit) * 100, 1) AS usage_percent,
    COALESCE(SUM(r.discount_amount), 0)              AS total_discount_given,
    c.is_active,
    c.valid_until
FROM coupons c
LEFT JOIN redemptions r ON r.coupon_id = c.id
GROUP BY c.id;

-- Query the view
SELECT * FROM coupon_summary ORDER BY usage_percent DESC;

-- 10.3 View: Customer Redemption Summary
CREATE OR REPLACE VIEW customer_savings AS
SELECT
    u.id, u.name, u.email,
    COUNT(r.id)            AS total_redemptions,
    SUM(r.discount_amount) AS total_saved,
    SUM(r.order_value)     AS total_spent_before_discount,
    SUM(r.final_amount)    AS total_paid
FROM users u
LEFT JOIN redemptions r ON r.user_id = u.id
WHERE u.role = 'customer'
GROUP BY u.id, u.name, u.email;

-- Query the view
SELECT * FROM customer_savings ORDER BY total_saved DESC;


-- ============================================================
-- SECTION 11: INDEXES (PERFORMANCE)
-- ============================================================

-- Index on coupon code (fast lookup during redeem)
CREATE INDEX idx_coupon_code   ON coupons(code);

-- Index on is_active + valid dates (common filter)
CREATE INDEX idx_coupon_active ON coupons(is_active, valid_until);

-- Index on user email (fast login lookup)
CREATE INDEX idx_user_email    ON users(email);

-- Index on redemptions for fast join
CREATE INDEX idx_redemption_coupon ON redemptions(coupon_id);
CREATE INDEX idx_redemption_user   ON redemptions(user_id);


-- ============================================================
-- SECTION 12: TRANSACTIONS (Redeem a Coupon Safely)
-- ============================================================

-- Atomically redeem coupon SAVE20 for user_id=2 with order_value=1000
START TRANSACTION;

    -- Step 1: Lock and validate
    SELECT id, code, usage_count, usage_limit, is_active,
           valid_from, valid_until, discount_type, discount_value, min_order_value
    FROM coupons
    WHERE code = 'SAVE20'
    FOR UPDATE;

    -- Step 2: Insert redemption record (calculated: 1000 * 20% = 200 discount)
    INSERT INTO redemptions (coupon_id, user_id, order_value, discount_amount, final_amount)
    VALUES (1, 2, 1000.00, 200.00, 800.00);

    -- Step 3: Increment usage count
    UPDATE coupons SET usage_count = usage_count + 1 WHERE code = 'SAVE20';

COMMIT;
-- ROLLBACK; -- Use this to undo if validation fails


-- ============================================================
-- END OF SQL QUERIES
-- ============================================================
