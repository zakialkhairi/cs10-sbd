const db = require('../database/db')

exports.getProducts = (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
}

exports.createProduct = (req, res) => {
  const { name, price, image } = req.body
  const numericPrice = Number(price)

  if (!name || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ error: 'Name and valid price are required' })
  }

  db.run(
    'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
    [name.trim(), Math.round(numericPrice), image?.trim() || ''],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.status(201).json({
        id: this.lastID,
        name: name.trim(),
        price: Math.round(numericPrice),
        image: image?.trim() || '',
      })
    }
  )
}
