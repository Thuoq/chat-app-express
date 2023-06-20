const { OK, BadRequestError, CREATED, AuthFailureError } = require('../core')
const { validationResult } = require('express-validator')
const AuthService = require('../services/auth.service')
const { REQUEST_HEADER } = require('../core')
const { addDays, addMinutes, addMilliseconds } = require('date-fns')
const { verifyToken } = require('../utils/auth')
const KeyTokenService = require('../services/keytoken.service')
class AuthController {
  async signUp(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    const { email, password, name } = req.body
    const metadata = await AuthService.signUp({
      email,
      password,
      name,
    })

    AuthController.setTokens(res, metadata.tokens)
    new CREATED({
      message: 'Sign Up success fully',
      metadata,
    }).send(res)
  }

  async logIn(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Email or Password wrong!')
    const { email, password } = req.body
    const metadata = await AuthService.logIn({
      email,
      password,
    })
    AuthController.setTokens(res, metadata.tokens)
    new OK({
      message: 'Login Success Fully',
      metadata,
    }).send(res)
  }
  async refreshToken(req, res, next) {
    const userId = +req.headers[REQUEST_HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    const refreshTokenPayload = req.cookies[REQUEST_HEADER.REFRESH_TOKEN]
    const keyToken = await KeyTokenService.findKeyTokenByUserId(userId)

    if (!keyToken) throw new AuthFailureError('Invalid Request')

    if (refreshTokenPayload) {
      const decodedUser = await verifyToken(
        refreshTokenPayload,
        keyToken.privateKey,
      )
      if (decodedUser.userId !== userId)
        throw new AuthFailureError('Invalid User')
    }
    const user = keyToken.user

    const metadata = await AuthService.handleRequestRefreshToken(
      user,
      keyToken,
      refreshTokenPayload,
    )
    AuthController.setTokens(res, metadata.tokens)
    new OK({
      message: 'Refresh Token Success Fully',
      metadata,
    }).send(res)
  }

  async logOut(req, res, next) {
    const userId = req.currentUser?.id
    res.clearCookie(REQUEST_HEADER.AUTHORIZATION)
    res.clearCookie(REQUEST_HEADER.REFRESH_TOKEN)
    new OK({
      message: 'Log Out Successfully',
      metadata: await AuthService.logOut(userId),
    }).send(res)
  }
  static setTokens(res, tokens = {}) {
    const today = new Date()
    res.cookie(REQUEST_HEADER.AUTHORIZATION, tokens.accessToken, {
      httpOnly: true,
      expires: addMilliseconds(today, Number(process.env.ACCESS_TOKEN_EXPIRE)),
      secure: true,
      sameSite: true,
    })
    res.cookie(REQUEST_HEADER.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: addDays(today, Number(process.env.REFRESH_TOKEN_EXPIRE_DAY)),
      secure: true,
      sameSite: true,
    })
  }
}
module.exports = new AuthController()
