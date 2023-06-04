const { prisma } = require('../database')
const { generatePassword } = require('../utils')
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

const getListUserInDb = (currentUserId, query) =>
  prisma.user.findMany({
    where: {
      id: {
        not: {
          equals: currentUserId,
        },
      },
      name: {
        contains: query.name,
      },
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      email: true,
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
}
