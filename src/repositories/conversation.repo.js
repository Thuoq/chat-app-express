const { prisma } = require('../database')
const { CONVERSATION_TYPE } = require('../utils')

const findConversationById = (id) => {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
  })
}

const createConversation4Group = ({ avatarUrl, name, memberIds }) => {
  return prisma.conversation.create({
    data: {
      avatarUrl,
      name,

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
      groupMembers: {
        some: {
          userId: currentUserId,
        },
      },
    },
    include: {
      groupMembers: {
        include: {
          user: {
            select: {
              id: true,
              avatarUrl: true,
              name: true,
            },
          },
        },
      },
    },
  })
}
const getListConversation = ({ currentUserId }) => {
  return getListConversationGroupByUser(currentUserId)
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
const createConversationOne2One = () =>
  prisma.conversation.create({
    select: {
      id: true,
    },
    data: {
      isDirectMessage: CONVERSATION_TYPE.directMessage,
    },
  })

const addMembersInGroup = (conversationId, payload = []) =>
  prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      groupMembers: {
        createMany: { data: payload.map((userId) => ({ userId })) },
      },
    },
    include: {
      groupMembers: {
        include: {
          user: {
            select: {
              id: true,
              avatarUrl: true,
              name: true,
            },
          },
        },
      },
    },
  })
module.exports = {
  createConversation4Group,
  getListConversationGroupByUser,
  findConversationGroupById,
  findConversationById,
  getListConversation,
  createConversationOne2One,
  addMembersInGroup,
}
