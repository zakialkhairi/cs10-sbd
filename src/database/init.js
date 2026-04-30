const bcrypt = require('bcrypt')
const pool = require('./db')

const ADMIN_EMAIL = 'zaki@gmail.com'
const ADMIN_PASSWORD = 'zaki123'

async function init_database() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      price INTEGER,
      image TEXT
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer'
    )
  `)

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'
  `)

  await pool.query(`
    UPDATE users
    SET role = 'customer'
    WHERE role IS NULL
  `)

  const admin_password = bcrypt.hashSync(ADMIN_PASSWORD, 10)

  await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role
    `,
    ['Zaki', ADMIN_EMAIL, admin_password, 'admin']
  )

  const product_count = await pool.query('SELECT COUNT(*) AS count FROM products')

  if (Number(product_count.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (name, price, image)
      VALUES
        ('Sepatu Nike', 500000, ''),
        ('Hoodie Oversize', 250000, ''),
        ('Tas Sling Bag', 150000, '')
    `)
  }
}

module.exports = init_database
