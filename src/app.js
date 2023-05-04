const express = require('express')
const compression = require('compression')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const cloudinary = require('cloudinary').v2
const cloudinaryConfig = require('./config/config.cloudinary')
const cookieParser = require('cookie-parser')
const appRoutes = require('./routes')
app.use(morgan('dev'))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(
  cors({
    origin: process.env.FE_BASE_URL,
    methods: '*',
    optionsSuccessStatus: 204,
    credentials: true,
  }),
)
app.use('/v1/api', appRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found!')
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode || 500,
    message: error.message || 'Internal Server',
  })
})
module.exports = app
