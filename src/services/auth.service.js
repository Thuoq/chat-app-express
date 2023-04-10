'use strict'

const { userRepo } = require('../repositories')
const keyTokenService = require('./keytoken.service')
const { BadRequestError } = require('../core')
const { generateTokens, isValidPassword } = require('../utils')
const crypto = require('node:crypto')
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
    const { refreshToken, accessToken } = tokens

    await keyTokenService.createKeyToken({
      userId: newUser.id,
      privateKey,
      publicKey,
      refreshToken,
    })
    return {
      refreshToken,
      accessToken,
    }
  }
  static logIn = async ({ email, password }) => {
    const user = await userRepo.findUserByEmail(email)
    if (!user) throw BadRequestError('Email or Password Invalid')
    const isMatchingPassword = isValidPassword({
      passwordPlainText: password,
      salt: user.salt,
      passwordHash: user.hash,
    })

    if (!isMatchingPassword) throw BadRequestError('Email or Password Invalid')

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const tokens = await generateTokens(
      { userId: user.id },
      privateKey,
      publicKey,
    )
    const { refreshToken, accessToken } = tokens

    await keyTokenService.createKeyToken({
      userId: user.id,
      privateKey,
      publicKey,
      refreshToken,
    })
    return {
      refreshToken,
      accessToken,
    }
  }

  static logOut = async (userId) => {
    return await keyTokenService.removeKeyTokenByUserId(userId)
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
