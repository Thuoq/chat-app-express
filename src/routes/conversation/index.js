const express = require('express')
const { checkAuthentication } = require('../../utils/auth')
const { asyncHandler } = require('../../core')
const conversationController = require('../../controllers/conversation.controller')
const router = express.Router()
// CHECK AUTHENTICATION
router.use(checkAuthentication)

// GET ROUTER
router.get('/', asyncHandler(conversationController.getAllConversationByUser))
router.post('/', asyncHandler(conversationController.createConversationByUser))
router.get('/', asyncHandler(conversationController))

module.exports = router
