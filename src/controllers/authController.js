const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

const SECRET = process.env.JWT_SECRET || 'secretkey123'
const ADMIN_EMAIL = 'zaki@gmail.com'

exports.register = (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const hashed = bcrypt.hashSync(password, 10)
  const cleanEmail = email.trim().toLowerCase()
  const cleanName = name.trim()
  const role = cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer'

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [cleanName, cleanEmail, hashed, role],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email already used' })
      }

      res.status(201).json({
        message: 'Register success',
        user: {
          id: this.lastID,
          name: cleanName,
          email: cleanEmail,
          role,
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
    }
  )
}
