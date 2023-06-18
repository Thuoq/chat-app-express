const { prisma } = require('../database')
const { CONVERSATION_TYPE } = require('../utils/constant')
const getListMessageOne2One = ({ currentUserId, targetUserId }) => {
  return prisma.message.findMany({
    where: {
      OR: [
        {
          fromUserId: currentUserId,
          toUserId: targetUserId,
        },
        {
          toUserId: currentUserId,
          fromUserId: targetUserId,
        },
      ],
      conversationId: null,
    },
    include: {
      sentBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      receivedBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdDatetime: 'asc',
    },
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
const getListMessageByConversationId = ({ conversationId, currentUserId }) => {
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

const getImagesMessageFromTargetUserId = ({ currentUserId, targetUserId }) => {
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
    },
  })
}
module.exports = {
  getListMessageOne2One,
  createMessage4Group,
  getListMessageGroupByMember,
  createMessages,
  getListMessageByConversationId,
  getListMessagesFromTargetUserId,
  getImagesFromConversation,
  getImagesMessageFromTargetUserId,
}
