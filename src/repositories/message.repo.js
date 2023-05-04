const { prisma } = require('../database')
const getListMessageOne2One = (currentUserId, targetUserId) => {
  return prisma.message.findMany({
    where: {
      fromUserId: currentUserId,
      toUserId: targetUserId,
      sentBy: {
        id: currentUserId,
      },
      receivedBy: {
        id: targetUserId,
      },
    },
    orderBy: {
      createdDatetime: 'desc',
    },
  })
}
const getOneMessageOne2One = (currentUserId, targetUserId) => {
  return prisma.message.findFirst({
    where: {
      fromUserId: currentUserId,
      toUserId: targetUserId,
      sentBy: {
        id: currentUserId,
      },
      receivedBy: {
        id: targetUserId,
      },
    },
  })
}

const createMessageOne2One = (currentUserId, body, conversationId = null) => {
  return prisma.$transaction(async (tx) => {
    const conversation = conversationId
      ? { id: conversationId }
      : await tx.conversation.create({
          data: {
            name: null,
          },
        })

    const message = tx.message.create({
      data: {
        content: body.content,
        fromUserId: currentUserId,
        toUserId: body.targetUserId,
        conversationId: conversation.id,
      },
    })
    return message
  })
}

module.exports = {
  getListMessageOne2One,
  createMessageOne2One,
  getOneMessageOne2One,
}
