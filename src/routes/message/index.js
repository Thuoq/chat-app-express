const express = require('express')
const router = express.Router({ mergeParams: true })
const messageController = require('../../controllers/message.controller')
const { asyncHandler } = require('../../core')

router.get('/', asyncHandler(messageController.getMessagesByConversationId))
router.post('/', asyncHandler(messageController.createMessageByConversationId))
module.exports = router
