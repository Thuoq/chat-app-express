const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/message.controller')
const { asyncHandler } = require('../../core')
const { checkAuthentication } = require('../../utils/auth')
const { body } = require('express-validator')
router.use(checkAuthentication)
router.get('/one-2-one', asyncHandler(messageController.getListMessageOne2One))
router.post(
  '/one-2-one/send-message',
  body('targetUserId').isNumeric(),
  body('content').isString(),
  asyncHandler(messageController.sendMessage2One),
)
router.post(
  '/group/:conversationId/send-message',
  asyncHandler(messageController.sendMessage2Group),
)
module.exports = router
