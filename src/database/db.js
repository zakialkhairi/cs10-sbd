const { Pool } = require('pg')

const connection_string = process.env.DATABASE_URL

if (!connection_string) {
  throw new Error('DATABASE_URL is required in .env')
}

const pool = new Pool({
  connectionString: connection_string,
  ssl: {
    rejectUnauthorized: false,
  },
})

pool.on('connect', () => {
  console.log('Connected to NeonDB')
})

pool.on('error', (err) => {
  console.error('NeonDB error:', err.message)
})

module.exports = pool
