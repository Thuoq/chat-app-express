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
const getListConversation = ({ isDirectMessage, currentUserId }) => {
  if (Number(isDirectMessage) === CONVERSATION_TYPE.group) {
    return getListConversationGroupByUser(currentUserId)
  }
  return getListDirectConversation(currentUserId)
}
const getListDirectConversation = (currentUserId) => {
  return prisma.conversation.findMany({
    where: {
      isDirectMessage: CONVERSATION_TYPE.directMessage,
      messages: {
        some: {
          OR: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
        },
      },
    },
    include: {
      messages: {
        take: 1,
        include: {
          receivedBy: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              statusCode: true,
            },
          },
          sentBy: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              statusCode: true,
            },
          },
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
  getListConversationByUser,
  createConversation4Group,
  getListConversationGroupByUser,
  findConversationGroupById,
  findConversationById,
  getListConversation,
  createConversationOne2One,
  addMembersInGroup,
}
