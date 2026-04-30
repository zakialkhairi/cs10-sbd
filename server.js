require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./src/database/db')
const init_database = require('./src/database/init')

const auth_routes = require('./src/routes/authRoutes')
const product_routes = require('./src/routes/productRoutes')

const app = express()
app.use(cors({
  origin: '*',
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Yakistore API is running')
})

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      message: 'DB connected',
      time: result.rows[0].now,
    })
  } catch (err) {
    res.status(500).json({
      error: 'DB connection failed',
      detail: err.message,
    })
  }
})

app.use('/products', product_routes)
app.use('/auth', auth_routes)

const PORT = process.env.PORT || 5000

async function start_server() {
  try {
    await init_database()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Database init failed:', err.message)
    process.exit(1)
  }
}

start_server()
