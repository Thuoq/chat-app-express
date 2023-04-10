'use strict'
const userRepo = require('../repositories/user.repo')
const keyTokenService = require('./keytoken.service')
const { BadRequestError, ForbiddenError, AuthFailureError } = require('../core')
const { generateTokens, isValidPassword, generate2Key } = require('../utils')
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
    const { privateKey, publicKey } = generate2Key()
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

    const { privateKey, publicKey } = generate2Key()
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
  static handleRequestRefreshToken = async (
    user,
    keyToken,
    refreshTokenPayload,
  ) => {
    const userId = user.id
    if (keyToken.refreshTokenUsed?.includes(refreshTokenPayload)) {
      await keyTokenService.removeKeyTokenById(keyToken.id)
      throw new ForbiddenError('Something wrong ! please login again')
    }
    if (keyToken.refreshToken !== refreshTokenPayload)
      throw new AuthFailureError('User not registered')

    const { privateKey, publicKey } = generate2Key()
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
    return {
      tokens,
    }
  }
}
module.exports = AuthService
