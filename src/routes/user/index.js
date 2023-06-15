const express = require('express')
const { uploadFile } = require('../../utils')
const { asyncHandler } = require('../../core')
const userController = require('../../controllers/user.controller')
const privateChatController = require('../../controllers/private-chat.controller')
const { body } = require('express-validator')

const router = express.Router()

router.post(
  '/upload-avatar',
  uploadFile.single('avatar'),
  asyncHandler(userController.uploadAvatar),
)
router.get('/', asyncHandler(userController.getListUserInDb))
router.patch(
  '/',
  body('name').isString(),
  asyncHandler(userController.updateInformation),
)
router.get('/online', asyncHandler(userController.getListUserOnline))

// PRIVATE CHAT ===========
router.get(
  '/users-recent-chats',
  asyncHandler(privateChatController.getListUsersRecentlyChat),
)
router.get(
  '/:targetUserId/messages',
  asyncHandler(privateChatController.getListMessagesFromTargetUser),
)
module.exports = router
