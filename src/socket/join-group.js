const { SOCKET_EVENT } = require('../utils/socket.event')
const { getKeyByValue } = require('../utils/object')
const { USER_ONLINE } = require('../global')
const conversationService = require('../services/conversation.service')
module.exports = (io, socket) => {
  socket.on(SOCKET_EVENT.JOIN_ROOM_START, async ({ roomId }) => {
    socket.join(roomId)
    const userId = getKeyByValue(USER_ONLINE, socket.id)
    if (userId) {
      const { conversations } = await conversationService.getListConversation({
        currentUserId: userId,
      })
      socket.emit(SOCKET_EVENT.JOIN_ROOM_SUCCESS, { conversations })
    }
  })
}
