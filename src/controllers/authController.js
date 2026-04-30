const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

const SECRET = process.env.JWT_SECRET || 'secretkey123'

exports.register = (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const hashed = bcrypt.hashSync(password, 10)

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name.trim(), email.trim().toLowerCase(), hashed],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email already used' })
      }

      res.status(201).json({
        message: 'Register success',
        user: {
          id: this.lastID,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        },
      })
    }
  )
}

exports.login = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email.trim().toLowerCase()],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      const valid = bcrypt.compareSync(password, user.password)

      if (!valid) {
        return res.status(400).json({ error: 'Wrong password' })
      }

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' })

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    }
  )
}
