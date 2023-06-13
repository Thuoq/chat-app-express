require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const server = http.createServer(app)
const MessageService = require('./src/services/message.service')
const { Server } = require('socket.io')
const { SOCKET_EVENT } = require('./src/utils/socket.event')
const { CONVERSATION_TYPE } = require('./src/utils/constant')
const ConversationService = require('./src/services/conversation.service')
const UserService = require('./src/services/user.service')
const io = new Server(server, {
  cors: {
    origin: process.env.FE_BASE_URL, // or the URL of your Vue.js front-end
    methods: ['GET', 'POST'],
  },
})
const PORT = process.env.PORT || 3004
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}
const usersConnection = {}
io.on('connection', (socket) => {
  // store the user id and corresponding socket id in the 'users' object
  socket.on(SOCKET_EVENT.SET_USER_ID, (userId) => {
    usersConnection[userId] = socket.id
    console.log('A user connected: ' + socket.id, ':::', usersConnection)
  })
  // when the user disconnects
  socket.on('disconnect', () => {
    const userId = getKeyByValue(usersConnection, socket.id)
    delete usersConnection[userId]
  })

  socket.on(
    SOCKET_EVENT.PRIVATE_CHAT,
    async ({
      senderId,
      targetUserId,
      conversationId: conversationIdPayload,
      ...payload
    }) => {
      const roomId = getPrivateChatRoomId(senderId, targetUserId)
      socket.join(roomId)
      const { messages, messagesImages, conversationId } =
        await MessageService.createMessage(
          {
            currentUserId: senderId,
            conversationId: conversationIdPayload,
            isDirectMessage: CONVERSATION_TYPE.directMessage,
          },
          { ...payload, targetUserId },
        )
      const conversationsOfSenders =
        await ConversationService.getListConversation({
          isDirectMessage: CONVERSATION_TYPE.directMessage,
          currentUserId: senderId,
        })

      // check target user is online
      const targetUserIsOnline = usersConnection[targetUserId]
      if (targetUserIsOnline) {
        const conversationOfReceive =
          await ConversationService.getListConversation({
            currentUserId: targetUserId,
            isDirectMessage: CONVERSATION_TYPE.directMessage,
          })
        const sendByUser = await UserService.getUserById(senderId)
        io.to(usersConnection[targetUserId]).emit(
          SOCKET_EVENT.SEND_MESSAGE_PRIVATE,
          {
            roomId,
            messages,
            messagesImages,
            conversations: conversationOfReceive.conversations,
            conversationId,
            sendBy: sendByUser,
          },
        )
      }
      io.to(usersConnection[senderId]).emit(SOCKET_EVENT.SEND_MESSAGE_PRIVATE, {
        roomId,
        messages,
        messagesImages,
        conversationId,
        conversations: conversationsOfSenders.conversations,
      }) // Update sender's UI
    },
  )
  socket.on(SOCKET_EVENT.USER_LOGOUT, (userId) => {
    delete usersConnection[userId]
    console.log('::: user connect when logout', usersConnection)
  })

  // socket.on(
  //   SOCKET_EVENT.SEND_MESSAGE,
  //   ({ conversationId, messageContent }) => {},
  // )
})

function getPrivateChatRoomId(userId1, userId2) {
  // sort the user IDs to ensure a consistent naming scheme
  const sortedIds = [userId1, userId2].sort()
  return `privateChat_${sortedIds[0]}_${sortedIds[1]}`
}
server.listen(PORT, () => {
  console.log('Connect on port:: ', PORT)
})
