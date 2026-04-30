const db = require('./db')

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
      password TEXT NOT NULL
    )
  `)

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
