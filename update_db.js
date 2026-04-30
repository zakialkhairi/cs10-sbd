require('dotenv').config();
const pool = require('./src/database/db');

async function updateDb() {
  try {
    // Add stock column if not exists
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`);
    
    // Clear existing products
    await pool.query(`DELETE FROM products`);
    
    // Reset auto-increment
    await pool.query(`ALTER SEQUENCE products_id_seq RESTART WITH 1`);
    
    // Insert new products
    await pool.query(`
      INSERT INTO products (name, price, stock, image)
      VALUES
        ('Laptop', 1000000, 10, ''),
        ('Mouse', 50000, 100, ''),
        ('Keyboard', 150000, 50, ''),
        ('Monitor', 300000, 20, '')
    `);
    
    console.log("Database updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating DB:", err);
    process.exit(1);
  }
}

updateDb();
