# 1. Title Page

## Discokart: Discount & Coupon Database System
**Course:** DBMS Mini Project

---

# 2. Table of Contents

1. [Title Page](#1-title-page)
2. [Table of Contents](#2-table-of-contents)
3. [Problem Statement](#3-problem-statement)
   - [Overview](#overview)
   - [Objectives](#objectives)
   - [Scope](#scope)
   - [Technology Stack](#technology-stack)
4. [Frontend](#4-frontend)
5. [Database & Query](#5-database--query)
6. [Conclusion](#6-conclusion)

---

# 3. Problem Statement

### Overview
Managing promotional codes, discounts, and customer redemptions can be a complex task for any e-commerce platform. Without a structured database system, businesses struggle with coupon abuse, expired validity validation, and tracking coupon effectiveness. The **Discokart Discount & Coupon Database System** is designed to provide a robust, secure, and scalable solution for managing active promotions and calculating customer savings.

### Objectives
- To develop a secure platform for administrators to create, manage, and monitor discount coupons.
- To allow customers to view available coupons and track their redemption history.
- To enforce coupon constraints such as usage limits, expiry dates, and minimum order values programmatically.
- To provide detailed insights into discount distribution and marketing effectiveness.

### Scope
The project encompasses the complete lifecycle of a coupon, including:
- **User Management**: Authentication and role-based access control (Admin vs. Customer).
- **Coupon Lifecycle**: Creation, activation, modification, and deactivation of percentage and fixed-amount coupons.
- **Redemption Processing**: Validating cart totals against coupon constraints and recording redemption transactions.
- **Reporting**: Displaying redemption statistics, total discounts given, and customer savings.

### Technology Stack
- **Frontend**: React.js, Vite, HTML5, CSS3
- **Backend / API**: Node.js, Express.js
- **Database**: Relational Database structure capable of managing structured data like Users, Coupons, Redemptions, and Products (queries formulated using standard SQL representations).
- **Security**: bcrypt.js (password hashing), jsonwebtoken (JWT authentication)

---

# 4. Frontend

The frontend is built as a Single Page Application (SPA) using React.js and Vite. It provides a highly responsive and dynamic user experience, seamlessly adapting to user roles. 

**Key Features of the Frontend:**
- **Role-Based Interfaces**: Specific dashboards catering to Admins (managing total coupons, viewing overall usage) and Customers (browsing products, applying coupons, viewing personal savings).
- **State Management**: Dynamic state handling for component rendering without reloading the page.
- **Modern UI/UX**: Styled with centralized CSS for a premium, clean aesthetic with interactive elements like hover effects and dynamic input validations. 
- **Integration**: Communication with the backend via Axios to fetch live data such as active coupons, product listings, and user histories.

---

# 5. Database & Query

The core of the DBMS mini-project lies in the structuring and querying of the relational data. 

### Core Database Entities:
1. **Users Table**: Stores user credentials, roles (admin/customer), and timestamps.
2. **Coupons Table**: Manages the coupon logic (code, discount_type, discount_value, min_order_value, validity periods, and usage limits).
3. **Products Table**: Holds the available catalog for simulation.
4. **Redemptions Table**: A transactional mapping table handling the exact records of which user used which coupon and the exact savings triggered.

### Key Queries and Operations:
- **Data Definition (DDL)**: Used to define schemas with strict constraints (e.g., verifying `valid_until` is greater than or equal to `valid_from`).
- **Data Manipulation (DML)**: Handling real-time transactional inserts (redemptions), updates (incrementing `usage_count`, deactivating expired codes), and conditional deletes.
- **Aggregate and Join Operations (DQL)**: 
  - Calculating total discounts given per coupon.
  - Tracking top customers by total money saved.
  - Checking live usage percentages per coupon capacity.
- **Views**: Simplified queries serving complex combinations like `active_coupons` (to instantly filter out expired/exhausted ones for customers) or `coupon_summary`.

---

# 6. Conclusion

The Discokart Discount & Coupon Database successfully fulfills the objectives of a modern database management system application. By maintaining strict referential integrity and implementing advanced SQL operations, the system prevents invalid redemptions and provides accurate, comprehensive tracking of all promotional activities. The inclusion of a robust user interface and a decoupled backend architecture demonstrates a scalable implementation of relational database principles in a real-world e-commerce context.
