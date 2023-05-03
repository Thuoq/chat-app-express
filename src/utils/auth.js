const crypto = require('node:crypto')
const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_EXPIRE = Number(process.env.ACCESS_TOKEN_EXPIRE)
const REFRESH_TOKEN_EXPIRE = '7d'
const { REQUEST_HEADER } = require('../core')
const { AuthFailureError, asyncHandler } = require('../core')
const KeyTokenService = require('../services/keytoken.service')
const generatePassword = (password) => {
  const salt = crypto.randomBytes(64).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  return {
    salt,
    hash,
  }
}
const isValidPassword = ({ passwordPlainText, salt, passwordHash }) => {
  const hash = crypto
    .pbkdf2Sync(passwordPlainText, salt, 1000, 64, 'sha512')
    .toString('hex')

  return hash === passwordHash
}
const generateTokens = async (payload, privateKey, publicKey) => {
  const accessTokenProcess = jwt.sign(payload, publicKey, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  })
  const refreshTokenProcess = jwt.sign(payload, privateKey, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  })
  const [accessToken, refreshToken] = await Promise.all([
    accessTokenProcess,
    refreshTokenProcess,
  ])
  return {
    accessToken,
    refreshToken,
  }
}
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

const checkAuthentication = asyncHandler(async (req, res, next) => {
  const userId = +req.headers[REQUEST_HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  const keyToken = await KeyTokenService.findKeyTokenByUserId(userId)

  if (!keyToken) throw new AuthFailureError('Invalid Request')
  // Handle When Refresh Token
  const refreshToken = req.headers[REQUEST_HEADER.REFRESH_TOKEN]
  if (refreshToken) {
    const decodedUser = await verifyToken(refreshToken, keyToken.privateKey)
    if (decodedUser.userId !== userId)
      throw new AuthFailureError('Invalid User')

    req.currentUser = keyToken.user
    req.keyToken = keyToken
    req.refreshTokenPayload = refreshToken
    return next()
  }

  // Handle When Access Token
  const accessToken = req.cookies[REQUEST_HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  const decodedUser = await verifyToken(accessToken, keyToken.publicKey)
  if (decodedUser.userId !== userId)
    throw new AuthFailureError('Invalid Request')

  req.currentUser = keyToken.user
  req.keyToken = keyToken

  return next()
})

const generate2Key = () => {
  const privateKey = crypto.randomBytes(64).toString('hex')
  const publicKey = crypto.randomBytes(64).toString('hex')
  return {
    privateKey,
    publicKey,
  }
}
module.exports = {
  isValidPassword,
  generatePassword,
  generateTokens,
  checkAuthentication,
  verifyToken,
  generate2Key,
}
