const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/message.controller')
const { asyncHandler } = require('../../core')
const { checkAuthentication } = require('../../utils/auth')
const { body, param, query } = require('express-validator')
const { uploadFile } = require('../../utils/file')
router.use(checkAuthentication)
router.post(
  '/upload-image',
  uploadFile.single('imageContent'),
  asyncHandler(messageController.handleUploadImage),
)
router.get(
  '/one-2-one',
  query('targetUserId').isString(),
  asyncHandler(messageController.getListMessageOne2One),
)
router.post(
  '/one-2-one/send-message',
  body('targetUserId').isNumeric(),
  body('content').isString(),
  asyncHandler(messageController.sendMessage2One),
)
router.post(
  '/group/:conversationId/send-message',
  param('conversationId').isString(),
  asyncHandler(messageController.sendMessage2Group),
)
router.get(
  '/group/:conversationId',
  param('conversationId').isString(),
  asyncHandler(messageController.getListMessage4Group),
)

module.exports = router
