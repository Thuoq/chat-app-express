const { getKeyByValue } = require('../utils/object')
const { USER_ONLINE } = require('../global')
const conversationService = require('../services/conversation.service')
module.exports = (io, socket) => {
  socket.on('disconnect', async () => {
    const userId = getKeyByValue(USER_ONLINE, socket.id)
    console.log(':::: run disconnect')
    if (userId) {
      const { conversations } = await conversationService.getListConversation({
        currentUserId: userId,
      })
      socket.leave(conversations.map((el) => el.roomId))
    }
    delete USER_ONLINE[userId]
  })
}
