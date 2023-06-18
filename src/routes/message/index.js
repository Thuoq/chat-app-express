const express = require('express')
const router = express.Router({ mergeParams: true })
const messageController = require('../../controllers/message.controller')
const groupChatController = require('../../controllers/group-chat.controller')
const { asyncHandler } = require('../../core')

router.get(
  '/',
  asyncHandler(groupChatController.getListMessageFromConversationId),
)
router.post('/', asyncHandler(messageController.createMessageByConversationId))
router.get(
  '/images',
  asyncHandler(messageController.getMessageImageByConversationId),
)
module.exports = router
