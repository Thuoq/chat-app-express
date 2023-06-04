const express = require('express')
const { uploadFile } = require('../../utils')
const { asyncHandler } = require('../../core')
const userController = require('../../controllers/user.controller')
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
router.get(
  '/:targetUserId/messages',
  asyncHandler(userController.getListMessagesFromTargetUser),
)
module.exports = router
