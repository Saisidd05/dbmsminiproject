const Datastore = require('nedb-promises');
const path = require('path');

const db = Datastore.create({
    filename: path.join(__dirname, 'coupons.db'),
    autoload: true,
});

// Ensure unique index on code (case-insensitive handled at app level)
db.ensureIndex({ fieldName: 'code', unique: true });

// Seed data (only inserted once on first run)
const SEED = [
    { code: 'SAVE20', description: 'Get 20% off on all items', discount_type: 'percentage', discount_value: 20, min_order_value: 500, valid_from: '2026-01-01', valid_until: '2026-12-31', usage_limit: 100, usage_count: 0, is_active: true },
    { code: 'FLAT150', description: 'Flat ₹150 off on orders above ₹999', discount_type: 'fixed', discount_value: 150, min_order_value: 999, valid_from: '2026-01-01', valid_until: '2026-06-30', usage_limit: 50, usage_count: 0, is_active: true },
    { code: 'WELCOME10', description: '10% off for new customers', discount_type: 'percentage', discount_value: 10, min_order_value: 0, valid_from: '2026-01-01', valid_until: '2026-12-31', usage_limit: 200, usage_count: 0, is_active: true },
    { code: 'SUMMER30', description: '30% Summer Sale discount', discount_type: 'percentage', discount_value: 30, min_order_value: 1000, valid_from: '2026-04-01', valid_until: '2026-06-30', usage_limit: 75, usage_count: 0, is_active: true },
    { code: 'FLASH500', description: '₹500 flat discount on premium orders', discount_type: 'fixed', discount_value: 500, min_order_value: 2500, valid_from: '2026-03-01', valid_until: '2026-03-31', usage_limit: 20, usage_count: 0, is_active: true },
];

async function seedIfEmpty() {
    const count = await db.count({});
    if (count === 0) {
        const now = new Date().toISOString();
        for (const item of SEED) {
            await db.insert({ ...item, created_at: now });
        }
        console.log('✅ Seed data inserted.');
    }
}

seedIfEmpty().catch(console.error);

module.exports = db;
