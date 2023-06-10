const express = require('express')
const app = express()
const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

// Middleware to parse JSON request bodies
app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// Register endpoint
app.post('/api/register', async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body

  try {
    // Perform database operation to register the user
    const client = await pool.connect()
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)'
    const values = [username, password]
    await client.query(query, values)
    client.release()

    res.json({ message: 'Registration successful' })
  } catch (error) {
    console.error('Registration failed:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Authenticate endpoint
app.post('/api/authenticate', async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body

  try {
    // Perform database operation to authenticate the user
    const client = await pool.connect()
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2'
    const values = [username, password]
    const result = await client.query(query, values)
    client.release()

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Authentication failed' })
    } else {
      // Generate a JWT token and send it back to the client
      const token = jwt.sign({ userId: result.rows[0].id }, 'your_secret_key')
      res.json({ token })
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    res.status(500).json({ message: 'Authentication failed' })
  }
})

// Protected endpoint
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your_secret_key')

    // Extract the userId from the decoded data
    const userId = decoded.userId
    console.log(userId)

    // Handle the protected route logic here

    res.json({ message: 'Protected route accessed' })
  } catch (error) {
    console.error('JWT verification failed:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
})

app.get('/status', (req, res) => {
  console.log('You hit the backend!')
})

// Start the server
const port = process.env.PORT | 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
