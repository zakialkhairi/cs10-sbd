const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../database/db')

const SECRET = process.env.JWT_SECRET || 'secretkey123'
const ADMIN_EMAIL = 'zaki@gmail.com'

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const clean_email = email.trim().toLowerCase()
  const clean_name = name.trim()
  const hashed_password = bcrypt.hashSync(password, 10)
  const role = clean_email === ADMIN_EMAIL ? 'admin' : 'customer'

  try {
    const result = await pool.query(
      `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role
      `,
      [clean_name, clean_email, hashed_password, role]
    )

    res.status(201).json({
      message: 'Register success',
      user: result.rows[0],
    })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already used' })
    }

    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    )
    const user = result.rows[0]

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const valid_password = bcrypt.compareSync(password, user.password)

    if (!valid_password) {
      return res.status(400).json({ error: 'Wrong password' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
