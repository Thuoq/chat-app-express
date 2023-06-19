const { SOCKET_EVENT } = require('../utils/socket.event')
const messageGroupService = require('../services/message-group.service')
const { USER_ONLINE } = require('../global')
const { getKeyByValue } = require('../utils/object')
module.exports = (io, socket) => {
  socket.on(
    SOCKET_EVENT.ADD_MEMBERS_IN_GROUP_START,
    async ({ conversationId, memberIds }) => {
      const { conversation } = await messageGroupService.addMembersIntoGroup(
        conversationId,
        memberIds,
      )

      const memberIdsOnline = memberIds.filter((el) => Boolean(USER_ONLINE[el]))

      // announcement user online
      const socketUsersOnline = memberIdsOnline.map((el) => USER_ONLINE[el])
      if (socketUsersOnline?.length) {
        io.to(socketUsersOnline).emit(
          SOCKET_EVENT.NOTIF_JUST_ADDED_INTO_GROUP,
          {
            conversation,
          },
        )
      }
    },
  )
}
