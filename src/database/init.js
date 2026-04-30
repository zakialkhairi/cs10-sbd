const bcrypt = require('bcrypt')
const db = require('./db')

const ADMIN_EMAIL = 'zaki@gmail.com'
const ADMIN_PASSWORD = 'zaki123'

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER,
      image TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer'
    )
  `)

  db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "customer"', (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('DB migration error:', err)
    }
  })

  db.run('UPDATE users SET role = "customer" WHERE role IS NULL')

  const adminPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10)
  db.get('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL], (err, user) => {
    if (err) {
      console.error('Admin seed error:', err)
      return
    }

    if (user) {
      db.run(
        'UPDATE users SET name = ?, password = ?, role = ? WHERE email = ?',
        ['Zaki', adminPassword, 'admin', ADMIN_EMAIL]
      )
      return
    }

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Zaki', ADMIN_EMAIL, adminPassword, 'admin']
    )
  })

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('DB init error:', err)
      return
    }

    if (!row || row.count === 0) {
      db.run(`
        INSERT INTO products (name, price, image)
        VALUES
          ('Sepatu Nike', 500000, ''),
          ('Hoodie Oversize', 250000, ''),
          ('Tas Sling Bag', 150000, '')
      `)
    }
  })
})
