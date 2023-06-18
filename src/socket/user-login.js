const { SOCKET_EVENT } = require('../utils/socket.event')
const { USER_ONLINE } = require('../global')
module.exports = (io, socket) => {
  // store the user id and corresponding socket id in the 'users' object
  socket.on(SOCKET_EVENT.SET_USER_ID, (userId) => {
    USER_ONLINE[userId] = socket.id
    console.log('A user connected: ' + socket.id, ':::', USER_ONLINE)
  })
}
