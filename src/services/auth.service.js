'use strict'
const userRepo = require('../repositories/user.repo')
const keyTokenService = require('./keytoken.service')
const { BadRequestError } = require('../core')
const { generateTokens, isValidPassword } = require('../utils')
const crypto = require('node:crypto')
const { getInfoData } = require('../utils/object')
class AuthService {
  static signUp = async ({ email, password, name }) => {
    const user = await userRepo.findUserByEmail(email)
    if (user) throw new BadRequestError('Email already exits !')
    const newUser = await userRepo.createUser({
      email,
      passwordPlainText: password,
      name,
    })
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const tokens = await generateTokens(
      { userId: newUser.id },
      privateKey,
      publicKey,
    )
    const { refreshToken } = tokens

    await keyTokenService.createKeyToken({
      userId: newUser.id,
      privateKey,
      publicKey,
      refreshToken,
    })
    return {
      tokens,
      user: getInfoData({
        fields: ['id', 'name', 'email'],
        obj: newUser,
      }),
    }
  }
  static logIn = async ({ email, password }) => {
    const user = await userRepo.findUserByEmail(email)
    if (!user) throw new BadRequestError('Email or Password Invalid')
    const isMatchingPassword = isValidPassword({
      passwordPlainText: password,
      salt: user.salt,
      passwordHash: user.hash,
    })

    if (!isMatchingPassword)
      throw new BadRequestError('Email or Password Invalid')

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const tokens = await generateTokens(
      { userId: user.id },
      privateKey,
      publicKey,
    )
    const { refreshToken } = tokens

    await keyTokenService.createKeyToken({
      userId: user.id,
      privateKey,
      publicKey,
      refreshToken,
    })
    return {
      tokens,
      user: getInfoData({
        fields: ['id', 'name', 'email'],
        obj: user,
      }),
    }
  }

  static logOut = async (userId) => {
    const keyToken = await keyTokenService.removeKeyTokenByUserId(userId)
    return keyToken
  }
  static handleRequestRefreshToken = async (userId, keyToken) => {
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const tokens = await generateTokens({ userId }, privateKey, publicKey)
    const { refreshToken } = tokens
    const refreshTokenUsed = keyToken.refreshTokenUsed
    refreshTokenUsed.push(refreshToken)
    await keyTokenService.updateKeyTokenByUserId(userId, {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokenUsed: refreshTokenUsed,
    })
    return refreshToken
  }
}
module.exports = AuthService
