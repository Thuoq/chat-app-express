const express = require('express')
const { asyncHandler } = require('../../core')
const conversationController = require('../../controllers/conversation.controller')
const router = express.Router()
const messageRouter = require('../message/index')

router.get('/', asyncHandler(conversationController.getListConversations))
router.use('/:id/messages', messageRouter)

module.exports = router
