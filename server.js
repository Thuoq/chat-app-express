require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 3004
let _userConnectCnt = 0

io.on('connection', (socket) => {
  _userConnectCnt++
  console.log('A User Connection have users:: ', _userConnectCnt)
})
server.listen(PORT, () => {
  console.log('Connect on port:: ', PORT)
})
