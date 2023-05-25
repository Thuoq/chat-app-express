const express = require('express')
const { checkAuthentication, uploadFile } = require('../../utils')
const { asyncHandler } = require('../../core')
const userController = require('../../controllers/user.controller')

const router = express.Router()

router.use(checkAuthentication)
router.post(
  '/upload-avatar',
  uploadFile.single('avatar'),
  asyncHandler(userController.uploadAvatar),
)
router.get('/online', asyncHandler(userController.getListUserOnline))
module.exports = router
