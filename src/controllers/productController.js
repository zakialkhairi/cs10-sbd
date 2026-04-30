const pool = require('../database/db')

exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC')
    res.json({
      success: true,
      message: 'Items retrieved successfully',
      payload: result.rows
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createProduct = async (req, res) => {
  const { name, price, image } = req.body
  const numeric_price = Number(price)

  if (!name || !Number.isFinite(numeric_price) || numeric_price <= 0) {
    return res.status(400).json({ error: 'Name and valid price are required' })
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO products (name, price, stock, image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, price, stock, image
      `,
      [name.trim(), Math.round(numeric_price), req.body.stock || 0, image?.trim() || '']
    )

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      payload: result.rows[0]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
