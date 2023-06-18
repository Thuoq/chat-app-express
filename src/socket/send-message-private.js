const { SOCKET_EVENT } = require('../utils/socket.event')
const MessagePrivateService = require('../services/message-private.service')
const UserService = require('../services/user.service')
const { USER_ONLINE } = require('../global')
module.exports = (io, socket) => {
  socket.on(
    SOCKET_EVENT.PRIVATE_CHAT,
    async ({ senderId, targetUserId, ...payload }) => {
      const { messages, messagesImages } =
        await MessagePrivateService.createMessage({
          currentUserId: senderId,
          ...payload,
          targetUserId,
        })
      const recentChatsOfSenders =
        await MessagePrivateService.getUsersRecentlyChat(senderId)

      // check target user is online
      const targetUserIsOnline = USER_ONLINE[targetUserId]
      if (targetUserIsOnline) {
        const [recentChatsOfReceive, sendByUser] = await Promise.all([
          MessagePrivateService.getUsersRecentlyChat(targetUserId),
          UserService.getUserById(senderId),
        ])

        io.to(USER_ONLINE[targetUserId]).emit(
          SOCKET_EVENT.SEND_MESSAGE_PRIVATE,
          {
            messages,
            messagesImages,
            recentChats: recentChatsOfReceive.users,
            sendBy: sendByUser,
            targetUserId: senderId,
          },
        )
      }
      io.to(USER_ONLINE[senderId]).emit(SOCKET_EVENT.SEND_MESSAGE_PRIVATE, {
        messages,
        messagesImages,
        recentChats: recentChatsOfSenders.users,
        targetUserId,
      }) // Update sender's UI
    },
  )
}
