const { prisma } = require('../database')
const { CONVERSATION_TYPE } = require('../utils/constant')
const getListMessageOne2One = (currentUserId, conversationId) => {
  return prisma.message.findMany({
    where: {
      OR: [
        {
          fromUserId: currentUserId,
        },
        {
          toUserId: currentUserId,
        },
      ],
      conversationId,
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
const getListMessageByConversationId = ({
  isDirectMessage,
  conversationId,
  currentUserId,
}) => {
  if (Number(isDirectMessage) === CONVERSATION_TYPE.directMessage) {
    return getListMessageOne2One(currentUserId, conversationId)
  }
  return getListMessageGroupByMember(currentUserId, conversationId)
}

const getListMessagesFromTargetUserId = (currentUserId, targetUserId) => {
  return prisma.message.findMany({
    where: {
      OR: [
        {
          fromUserId: currentUserId,
          toUserId: targetUserId,
        },
        {
          fromUserId: targetUserId,
          toUserId: currentUserId,
        },
      ],
      conversation: {
        isDirectMessage: CONVERSATION_TYPE.directMessage,
      },
    },
    include: {
      conversation: true,
      sentBy: {
        select: {
          avatarUrl: true,
          statusCode: true,
          name: true,
        },
      },
      receivedBy: {
        select: {
          avatarUrl: true,
          statusCode: true,
          name: true,
        },
      },
    },
  })
}

const createMessages = ({ payload }) =>
  prisma.message.createMany({
    data: payload,
  })

const getImagesFromConversation = ({ conversationId, conversationType }) =>
  prisma.message.findMany({
    where: {
      conversation: {
        isDirectMessage: conversationType,
        id: conversationId,
      },
      content: null,
      imageUrl: {
        not: null,
      },
    },
  })

const getImagesMessageFromTargetUserId = (currentUserId, targetUserId) => {
  return prisma.message.findMany({
    where: {
      OR: [
        {
          fromUserId: currentUserId,
          toUserId: targetUserId,
        },
        {
          fromUserId: targetUserId,
          toUserId: currentUserId,
        },
      ],
      content: null,
      imageUrl: {
        not: null,
      },
      conversation: {
        isDirectMessage: CONVERSATION_TYPE.directMessage,
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
  createMessages,
  getListMessageByConversationId,
  getListMessagesFromTargetUserId,
  getImagesFromConversation,
  getImagesMessageFromTargetUserId,
}
