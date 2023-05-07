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
module.exports = {
  findUserByEmail,
  createUser,
  getListContactByUser,
  findUserById,
  updateUserByPayload,
  getListUserByFromIds,
}
