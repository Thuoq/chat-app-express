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
    include: {
      sentBy: {
        select: {
          avatarUrl: true,
        },
      },
      receivedBy: {
        select: {
          avatarUrl: true,
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
            isDirectMessage: CONVERSATION_TYPE.directMessage,
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
const createMessage4Group = (currentUserId, conversationId, payload) => {
  return prisma.message.create({
    data: {
      conversationId,
      fromUserId: currentUserId,
      content: payload.content,
    },
  })
}
const getListMessageGroupByMember = (memberId, conversationId) => {
  return prisma.message.findMany({
    where: {
      conversation: {
        id: conversationId,
        groupMembers: {
          some: {
            userId: memberId,
          },
        },
      },
    },
  })
}
module.exports = {
  getListMessageOne2One,
  createMessageOne2One,
  getOneMessageOne2One,
  createMessage4Group,
  getListMessageGroupByMember,
}
