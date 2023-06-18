const { SOCKET_EVENT } = require('../utils/socket.event')
const { USER_ONLINE } = require('../global')
const conversationService = require('../services/conversation.service')
module.exports = (io, socket) => {
  // store the user id and corresponding socket id in the 'users' object
  socket.on(SOCKET_EVENT.SET_USER_ID, async (userId) => {
    USER_ONLINE[userId] = socket.id
    // get group id;

    const { conversations } = await conversationService.getListConversation({
      currentUserId: userId,
    })

    socket.join(conversations.map((con) => con.roomId))

    console.log('A user connected: ' + socket.id, ':::', USER_ONLINE)
  })
}
