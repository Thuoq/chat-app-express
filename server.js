require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const server = http.createServer(app)
const { Server } = require('socket.io')
const socketHandler = require('./src/socket')
const io = new Server(server, {
  cors: {
    origin: process.env.FE_BASE_URL, // or the URL of your Vue.js front-end
    methods: ['GET', 'POST'],
  },
})
const PORT = process.env.PORT || 3004

io.on('connection', (socket) => {
  socketHandler(io, socket)
})

server.listen(PORT, () => {
  console.log('Connect on port:: ', PORT)
})
