const { prisma } = require('../database')

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
      name: '',
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

module.exports = {
  getListConversationByUser,
  createConversationByUser,
}
