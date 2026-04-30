require('./src/database/init')

const express = require('express')
const cors = require('cors')

const authRoutes = require('./src/routes/authRoutes')
const productRoutes = require('./src/routes/productRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Yakistore API is running')
})

app.use('/products', productRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
