const { prisma } = require('../database')
const getListMessageOne2One = (currentUserId, targetUserId) => {
  return prisma.message.findMany({
    where: {
      fromUserId: {
        in: [currentUserId, targetUserId],
      },
      toUserId: {
        in: [currentUserId, targetUserId],
      },
      sentBy: {
        id: {
          in: [currentUserId, targetUserId],
        },
      },
      receivedBy: {
        id: {
          in: [currentUserId, targetUserId],
        },
      },
    },
    orderBy: {
      createdDatetime: 'asc',
    },
  })
}
const getOneMessageOne2One = (currentUserId, targetUserId) => {
  return prisma.message.findFirst({
    where: {
      fromUserId: {
        in: [currentUserId, targetUserId],
      },
      toUserId: {
        in: [currentUserId, targetUserId],
      },
      sentBy: {
        id: {
          in: [currentUserId, targetUserId],
        },
      },
      receivedBy: {
        id: {
          in: [currentUserId, targetUserId],
        },
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
