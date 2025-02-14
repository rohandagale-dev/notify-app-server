const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const user_routes = require('./routes/user')
const request_routes = require('./routes/request')
const dashboard_routes = require('./routes/dashboard')
const authentication__routes = require('./routes/auth')
const message_routes = require('./routes/message')
const { verifyToken } = require('./middleware/VerifyToken')

const app = express()
dotenv.config()

/*------------------ MIDDLEWARE ------------------------------*/
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

/*------------------ ENVIRONMENT VARIABLES --------------------*/
const allow_origin = process.env.ALLOWED_ORIGIN
const PORT = process.env.PORT || 5000

/*------------------ CORS CONFIGURATION ------------------------*/
const corsOptions = {
  origin: allow_origin,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  optionsSuccessStatus: 200,
}

/*------------------ MONGODB CONNECTION ---------------------*/
require('./db')
app.use(cors(corsOptions))

/*------------------ ROUTES -----------------------------------------*/
//Auth Routes
app.use('/auth', authentication__routes)

// User Routes Not protected
app.use('/', user_routes)

// Dashboard Routes (protected)
app.use('/dashboard', verifyToken, dashboard_routes)

// Message Routes (protected)
app.use('/message', verifyToken, message_routes)

// Request Routes (protected)
app.use('/request', verifyToken, request_routes)

// Home Route
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Server is running healthy' })
})

/*------------------ SERVER CONFIGURATION ----------------------*/
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
