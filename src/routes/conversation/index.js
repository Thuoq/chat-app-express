const express = require('express')
const { checkAuthentication, uploadFile } = require('../../utils')
const { asyncHandler } = require('../../core')
const conversationController = require('../../controllers/conversation.controller')
const router = express.Router()
// CHECK AUTHENTICATION
router.use(checkAuthentication)

router.post(
  '/group',
  uploadFile.single('avatar'),
  asyncHandler(conversationController.createConversation4Group),
)
router.get(
  '/group',
  asyncHandler(conversationController.getLitConversationGroupByUser),
)

module.exports = router
