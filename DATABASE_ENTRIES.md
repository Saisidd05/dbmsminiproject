# 📊 Discokart Database Entries

Here are the records successfully inserted into your local database.

## Table: `USERS`

| id | name | email | password | role | created_at |
|---|---|---|---|---|---|
| 1 | Admin User | admin@test.com | $2a$10$hashedpassword1 | admin | 2026-03-21 06:34:21 |
| 2 | System Admin | sysadmin@test.com | $2a$10$hashedpassword1 | admin | 2026-03-21 06:34:21 |
| 3 | Siva Kumar | siva@test.com | $2a$10$hashedpassword2 | customer | 2026-03-21 06:34:21 |
| 4 | Priya S | priya@test.com | $2a$10$hashedpassword3 | customer | 2026-03-21 06:34:21 |
| 5 | Ravi K | ravi@test.com | $2a$10$hashedpassword4 | customer | 2026-03-21 06:34:21 |
| 6 | Karthik Raja | karthik@test.com | $2a$10$hashedpassword5 | customer | 2026-03-21 06:34:21 |
| 7 | Deepa N | deepa@test.com | $2a$10$hashedpassword6 | customer | 2026-03-21 06:34:21 |
| 8 | Aravind M | aravind@test.com | $2a$10$hashedpassword7 | customer | 2026-03-21 06:34:21 |
| 9 | Meena V | meena@test.com | $2a$10$hashedpassword8 | customer | 2026-03-21 06:34:21 |
| 10 | Vijay P | vijay@test.com | $2a$10$hashedpassword9 | customer | 2026-03-21 06:34:21 |
| 11 | Anitha R | anitha@test.com | $2a$10$hashedpass10 | customer | 2026-03-21 06:34:21 |
| 12 | Suresh G | suresh@test.com | $2a$10$hashedpass11 | customer | 2026-03-21 06:34:21 |

<br>

## Table: `COUPONS`

| id | code | description | discount_type | discount_value | min_order_value | valid_from | valid_until | usage_limit | usage_count | is_active | created_at |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SAVE20 | Get 20% off on all items | percentage | 20.0 | 500.0 | 2026-01-01 | 2026-12-31 | 100 | 5 | 1 | 2026-03-21 06:34:21 |
| 2 | FLAT150 | Flat ₹150 off on orders above ₹999 | fixed | 150.0 | 999.0 | 2026-01-01 | 2026-06-30 | 50 | 2 | 1 | 2026-03-21 06:34:21 |
| 3 | WELCOME10 | 10% off for new customers | percentage | 10.0 | 0.0 | 2026-01-01 | 2026-12-31 | 200 | 3 | 1 | 2026-03-21 06:34:21 |
| 4 | SUMMER30 | 30% Summer Sale discount | percentage | 30.0 | 1000.0 | 2026-04-01 | 2026-06-30 | 75 | 0 | 1 | 2026-03-21 06:34:21 |
| 5 | FLASH500 | ₹500 flat discount on premium orders | fixed | 500.0 | 2500.0 | 2026-03-01 | 2026-03-31 | 20 | 1 | 1 | 2026-03-21 06:34:21 |
| 6 | DISWALI50 | Diwali Dhamaka 50% Off | percentage | 50.0 | 2000.0 | 2026-10-01 | 2026-11-15 | 500 | 0 | 1 | 2026-03-21 06:34:21 |
| 7 | TechFest25 | 25% Off on Electronics | percentage | 25.0 | 1500.0 | 2026-02-01 | 2026-04-30 | 100 | 2 | 1 | 2026-03-21 06:34:21 |
| 8 | FLAT50 | ₹50 off on small orders | fixed | 50.0 | 200.0 | 2026-01-01 | 2026-12-31 | 1000 | 10 | 1 | 2026-03-21 06:34:21 |
| 9 | MONSOON15 | 15% off during rainy season | percentage | 15.0 | 600.0 | 2026-07-01 | 2026-09-30 | 200 | 0 | 1 | 2026-03-21 06:34:21 |
| 10 | EXPIRED100 | Old ₹100 flat discount | fixed | 100.0 | 500.0 | 2025-01-01 | 2025-12-31 | 100 | 100 | 0 | 2026-03-21 06:34:21 |

<br>

## Table: `PRODUCTS`

| id | name | price | category | emoji | rating | reviews | created_at |
|---|---|---|---|---|---|---|---|
| 1 | Wireless Headphones Pro | 1499.0 | Electronics | 🎧 | 4.5 | 128 | 2026-03-21 06:34:21 |
| 2 | Mechanical Keyboard RGB | 2999.0 | Electronics | ⌨️ | 4.7 | 86 | 2026-03-21 06:34:21 |
| 3 | Casual T-Shirt (Blue) | 499.0 | Clothing | 👕 | 4.2 | 214 | 2026-03-21 06:34:21 |
| 4 | Running Shoes V2 | 1999.0 | Footwear | 👟 | 4.6 | 183 | 2026-03-21 06:34:21 |
| 5 | Coffee Mug (Ceramic) | 349.0 | Kitchen | ☕ | 4.8 | 302 | 2026-03-21 06:34:21 |
| 6 | Travel Backpack | 1299.0 | Accessories | 🎒 | 4.4 | 95 | 2026-03-21 06:34:21 |
| 7 | Aviator Sunglasses | 799.0 | Accessories | 🕶️ | 4.3 | 67 | 2026-03-21 06:34:21 |
| 8 | Steel Water Bottle | 599.0 | Kitchen | 🍶 | 4.6 | 421 | 2026-03-21 06:34:21 |
| 9 | Bluetooth Speaker Mini | 2499.0 | Electronics | 🔊 | 4.5 | 158 | 2026-03-21 06:34:21 |
| 10 | LED Desk Lamp | 899.0 | Furniture | 💡 | 4.4 | 77 | 2026-03-21 06:34:21 |
| 11 | Yoga Mat (Non-slip) | 699.0 | Sports | 🧘 | 4.7 | 199 | 2026-03-21 06:34:21 |
| 12 | Notebook Set 3-Pack | 249.0 | Stationery | 📓 | 4.5 | 342 | 2026-03-21 06:34:21 |
| 13 | Gaming Mouse | 1299.0 | Electronics | 🖱️ | 4.8 | 310 | 2026-03-21 06:34:21 |
| 14 | Smart Watch Series 5 | 4999.0 | Electronics | ⌚ | 4.6 | 450 | 2026-03-21 06:34:21 |
| 15 | Cotton Jeans | 1199.0 | Clothing | 👖 | 4.1 | 150 | 2026-03-21 06:34:21 |
| 16 | Leather Wallet | 850.0 | Accessories | 👛 | 4.5 | 80 | 2026-03-21 06:34:21 |
| 17 | Protein Shaker | 299.0 | Sports | 🥤 | 4.3 | 210 | 2026-03-21 06:34:21 |
| 18 | Office Chair Ergonomic | 6500.0 | Furniture | 🪑 | 4.7 | 115 | 2026-03-21 06:34:21 |
| 19 | Smartphone Stand | 199.0 | Accessories | 📱 | 4.2 | 88 | 2026-03-21 06:34:21 |
| 20 | Dumbbell Set (5kg) | 1500.0 | Sports | 🏋️ | 4.8 | 520 | 2026-03-21 06:34:21 |

<br>

## Table: `REDEMPTIONS`

| id | coupon_id | user_id | order_value | discount_amount | final_amount | redeemed_at |
|---|---|---|---|---|---|---|
| 1 | 1 | 3 | 1000.0 | 200.0 | 800.0 | 2026-01-15 10:30:00 |
| 2 | 3 | 4 | 500.0 | 50.0 | 450.0 | 2026-01-16 11:45:00 |
| 3 | 1 | 5 | 1500.0 | 300.0 | 1200.0 | 2026-01-20 09:15:00 |
| 4 | 2 | 3 | 1200.0 | 150.0 | 1050.0 | 2026-02-05 14:20:00 |
| 5 | 7 | 6 | 2000.0 | 500.0 | 1500.0 | 2026-02-10 16:00:00 |
| 6 | 8 | 7 | 350.0 | 50.0 | 300.0 | 2026-02-15 18:30:00 |
| 7 | 1 | 8 | 800.0 | 160.0 | 640.0 | 2026-02-20 12:10:00 |
| 8 | 5 | 9 | 3000.0 | 500.0 | 2500.0 | 2026-03-05 08:30:00 |
| 9 | 1 | 10 | 600.0 | 120.0 | 480.0 | 2026-03-10 20:45:00 |
| 10 | 3 | 11 | 400.0 | 40.0 | 360.0 | 2026-03-12 21:00:00 |
| 11 | 8 | 12 | 250.0 | 50.0 | 200.0 | 2026-03-14 15:50:00 |
| 12 | 2 | 4 | 1800.0 | 150.0 | 1650.0 | 2026-03-15 10:05:00 |
| 13 | 1 | 6 | 2200.0 | 440.0 | 1760.0 | 2026-03-18 19:25:00 |
| 14 | 7 | 8 | 1600.0 | 400.0 | 1200.0 | 2026-03-20 13:40:00 |

<br>

