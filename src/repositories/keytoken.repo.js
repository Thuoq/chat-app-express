const { prisma } = require('../database')

const findKeyTokenByUserId = (userId) =>
  prisma.keyToken.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  })

const createKeyToken = async ({
  userId,
  privateKey,
  publicKey,
  refreshToken,
  refreshTokenUsed = [],
}) => {
  return prisma.keyToken.create({
    data: {
      refreshTokenUsed,
      privateKey,
      publicKey,
      userId,
      refreshToken,
    },
  })
}
const removeKeyTokenByUserId = (userId) => {
  return prisma.keyToken.delete({
    where: {
      userId,
    },
  })
}
const updateKeyTokenByUserId = (userId, payload) => {
  return prisma.keyToken.update({
    where: {
      userId,
    },
    data: payload,
  })
}
module.exports = {
  findKeyTokenByUserId,
  createKeyToken,
  removeKeyTokenByUserId,
  updateKeyTokenByUserId,
}
