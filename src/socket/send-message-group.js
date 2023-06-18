const { SOCKET_EVENT } = require('../utils/socket.event')
const MessageGroupService = require('../services/message-group.service')
module.exports = (io, socket) => {
  socket.on(SOCKET_EVENT.SEND_MESSAGE_GROUP_START, async (body) => {
    const { roomId, conversationId, currentUserId, ...payload } = body
    const { messages, messagesImages } =
      await MessageGroupService.createMessage(body)
    io.in(roomId).emit(SOCKET_EVENT.SEND_MESSAGE_GROUP_COMPLETED, {
      roomId,
      conversationId,
      messages,
      messagesImages,
    })
  })
}
