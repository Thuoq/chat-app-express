const { prisma } = require('../database')
const { generatePassword } = require('../utils')
const { CONVERSATION_TYPE } = require('../utils/constant')
const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  })
const createUser = ({ email, passwordPlainText, name }) => {
  const { hash, salt } = generatePassword(passwordPlainText)
  return prisma.user.create({
    data: {
      email,
      name,
      hash,
      salt,
    },
  })
}
const getListContactByUser = (userId) => {
  return prisma.user.findMany({
    where: {
      id: {
        notIn: [userId],
      },
    },
  })
}
const findUserById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
}
const updateUserByPayload = (userId, payload) =>
  prisma.user.update({
    where: { id: userId },
    data: payload,
  })

const getListUserByFromIds = (userIds) =>
  prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  })

const getListUserByStatusCode = (statusCode) =>
  prisma.user.findMany({
    where: {
      statusCode,
    },
  })

const getListUserInDb = ({ excludeUserIds, name }) => {
  return prisma.user.findMany({
    where: {
      id: {
        notIn: excludeUserIds,
      },
      name: {
        contains: name,
      },
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      email: true,
      statusCode: true,
    },
  })
}
const getRecentUsersChatById = (userId) =>
  prisma.user.findMany({
    where: {
      OR: [
        {
          messagesReceived: {
            some: {
              OR: [
                {
                  fromUserId: userId,
                },
                {
                  toUserId: userId,
                },
              ],
              conversationId: null,
            },
          },
        },
        {
          messagesSent: {
            some: {
              OR: [
                {
                  fromUserId: userId,
                },
                {
                  toUserId: userId,
                },
              ],
              conversationId: null,
            },
          },
        },
      ],
      id: {
        not: userId,
      },
    },
  })
module.exports = {
  findUserByEmail,
  createUser,
  getListContactByUser,
  findUserById,
  updateUserByPayload,
  getListUserByFromIds,
  getListUserByStatusCode,
  getListUserInDb,
  getRecentUsersChatById,
}
