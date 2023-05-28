const { prisma } = require('../database')
const { CONVERSATION_TYPE } = require('../utils/constant')
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
        content: body.content ? body.content : undefined,
        fromUserId: currentUserId,
        toUserId: body.targetUserId,
        conversationId: conversation.id,
      },
    })
    return message
  })
}
const createMessageOne2OneWhenImage = (
  currentUserId,
  payload,
  conversationId,
) => {
  return prisma.$transaction(async (tx) => {
    const conversation = conversationId
      ? { id: conversationId }
      : await tx.conversation.create({
          data: {
            name: null,
            isDirectMessage: CONVERSATION_TYPE.directMessage,
          },
        })

    const listMessage = tx.message.createMany({
      data: payload.map(({ imageUrl, targetUserId }) => ({
        imageUrl,
        fromUserId: currentUserId,
        toUserId: targetUserId,
        conversationId: conversation.id,
      })),
    })
    return listMessage
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
    include: {
      sentBy: {
        select: {
          name: true,
          avatarUrl: true,
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
  createMessageOne2OneWhenImage,
}
