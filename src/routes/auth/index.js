const express = require('express')
const { asyncHandler } = require('../../core')
const authController = require('../../controllers/auth.controller')
const { body } = require('express-validator')
const { checkAuthentication } = require('../../utils/auth')
const router = express.Router()

// SIGNUP
router.post(
  '/sign-up',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').isString(),
  asyncHandler(authController.signUp),
)
// LOGIN
router.post(
  '/sign-in',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  asyncHandler(authController.logIn),
)
// FORGOT PASSWORD
router.post('/forgot-password', body('email').isEmail(), asyncHandler())
router.get('/refresh-token', asyncHandler(authController.refreshToken))

router.use(checkAuthentication)
// LOGOUT
router.post('/logout', asyncHandler(authController.logOut))

// Refresh Token
module.exports = router
