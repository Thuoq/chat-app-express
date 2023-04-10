const { OK, BadRequestError } = require('../core')
const { validationResult } = require('express-validator')
const AuthService = require('../services/auth.service')
class AuthController {
  async signUp(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    const { email, password, name } = req.body
    new OK({
      message: 'Sign Up success fully',
      metadata: await AuthService.signUp({
        email,
        password,
        name,
      }),
    }).send(res)
  }

  async logIn(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Email or Password wrong!')
    const { email, password } = req.body
    new OK({
      message: 'Login Success Fully',
      metadata: await AuthService.logIn({
        email,
        password,
      }),
    }).send(res)
  }
  async refreshToken(req, res, next) {}

  async logOut(req, res, next) {
    const userId = req.currentUser?.id
    new OK({
      message: 'Log Out Successfully',
      metadata: await AuthService.logOut(userId),
    }).send(res)
  }
}
module.exports = new AuthController()
