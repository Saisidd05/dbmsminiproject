const Datastore = require('nedb-promises')
const path = require('path')

const products = Datastore.create({
    filename: path.join(__dirname, 'data', 'products.db'),
    autoload: true
})

const SAMPLE_PRODUCTS = [
    { name: 'Wireless Headphones', price: 1499, category: 'Electronics', emoji: '🎧', rating: 4.5, reviews: 128 },
    { name: 'Mechanical Keyboard', price: 2999, category: 'Electronics', emoji: '⌨️', rating: 4.7, reviews: 86 },
    { name: 'Casual T-Shirt', price: 499, category: 'Clothing', emoji: '👕', rating: 4.2, reviews: 214 },
    { name: 'Running Shoes', price: 1999, category: 'Footwear', emoji: '👟', rating: 4.6, reviews: 183 },
    { name: 'Coffee Mug', price: 349, category: 'Kitchen', emoji: '☕', rating: 4.8, reviews: 302 },
    { name: 'Backpack', price: 1299, category: 'Accessories', emoji: '🎒', rating: 4.4, reviews: 95 },
    { name: 'Sunglasses', price: 799, category: 'Accessories', emoji: '🕶️', rating: 4.3, reviews: 67 },
    { name: 'Water Bottle', price: 599, category: 'Kitchen', emoji: '🍶', rating: 4.6, reviews: 421 },
    { name: 'Bluetooth Speaker', price: 2499, category: 'Electronics', emoji: '🔊', rating: 4.5, reviews: 158 },
    { name: 'Desk Lamp', price: 899, category: 'Furniture', emoji: '💡', rating: 4.4, reviews: 77 },
    { name: 'Yoga Mat', price: 699, category: 'Sports', emoji: '🧘', rating: 4.7, reviews: 199 },
    { name: 'Notebook Set', price: 249, category: 'Stationery', emoji: '📓', rating: 4.5, reviews: 342 },
]

async function seedProducts() {
    const count = await products.count({})
    if (count === 0) {
        await products.insert(SAMPLE_PRODUCTS)
        console.log('✅ Products seeded.')
    }
}

seedProducts()

module.exports = products
