const express = require('express')
const { asyncHandler } = require('../../core')
const conversationController = require('../../controllers/conversation.controller')
const router = express.Router()
const messageRouter = require('../message/index')
const { uploadFile } = require('../../utils/file')

router.get('/', asyncHandler(conversationController.getListConversations))
router.post(
  '/group',
  uploadFile.single('avatar'),
  asyncHandler(conversationController.createConversation4Group),
)
// Group add members
router.post(
  '/:id/group-members',
  asyncHandler(conversationController.addMembersIntoGroup),
)

router.use('/:id/messages', messageRouter)

module.exports = router
