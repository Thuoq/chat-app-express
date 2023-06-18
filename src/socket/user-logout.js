const { getKeyByValue } = require('../utils/object')
const { USER_ONLINE } = require('../global')
module.exports = (io, socket) => {
  socket.on('disconnect', () => {
    const userId = getKeyByValue(USER_ONLINE, socket.id)
    delete USER_ONLINE[userId]
  })
}
