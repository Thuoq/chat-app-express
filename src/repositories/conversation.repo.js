const { prisma } = require('../database')
const { CONVERSATION_TYPE } = require('../utils')

const getListConversationByUser = (userId) =>
  prisma.conversation.findMany({
    where: {
      groupMember: {
        some: {
          userId,
        },
      },
    },
    include: {
      messages: {
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdDatetime: 'asc',
    },
  })
const createConversationByUser = (currentUserId, payload) => {
  return prisma.conversation.create({
    data: {
      groupMember: {
        createMany: {
          data: [{ userId: currentUserId }, { userId: payload.targetUserId }],
        },
      },
    },
  })
}
const getConversationByUser = () => {
  return prisma.conversation.findFirst({})
}

const createConversation4Group = ({ avatarUrl, name, memberIds }) => {
  return prisma.conversation.create({
    data: {
      avatarUrl,
      name,
      isDirectMessage: CONVERSATION_TYPE.group,
      groupMembers: {
        createMany: {
          data: memberIds.map((el) => ({
            userId: el,
          })),
        },
      },
    },
  })
}
const getListConversationGroupByUser = (currentUserId) => {
  return prisma.conversation.findMany({
    where: {
      isDirectMessage: CONVERSATION_TYPE.group,
      groupMembers: {
        some: {
          userId: currentUserId,
        },
      },
    },
  })
}
const findConversationGroupById = (id, currentUserId) =>
  prisma.conversation.findFirst({
    where: {
      id,
      isDirectMessage: CONVERSATION_TYPE.group,
      groupMembers: {
        some: {
          userId: currentUserId,
        },
      },
    },
  })
module.exports = {
  getListConversationByUser,
  createConversationByUser,
  createConversation4Group,
  getListConversationGroupByUser,
  findConversationGroupById,
}
