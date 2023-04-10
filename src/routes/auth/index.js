const express = require('express')
const { asyncHandler } = require('../../core')
const authController = require('../../controllers/auth.controller')
const { body } = require('express-validator')
const { checkAuthentication } = require('../../utils/auth')
const router = express.Router()

router.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  asyncHandler(authController.signUp),
)
// LOGIN
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  asyncHandler(authController.logIn),
)
router.use(checkAuthentication)
// LOGOUT
router.post('/logout', asyncHandler(authController.logOut))

// Refresh Token
router.post('/refresh-token', asyncHandler(authController.refreshToken))
module.exports = router
