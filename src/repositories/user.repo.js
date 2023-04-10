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

module.exports = {
  findUserByEmail,
  createUser,
}
