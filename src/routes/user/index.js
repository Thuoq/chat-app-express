const express = require('express')
const { checkAuthentication } = require('../../utils/auth')
const multer = require('multer')
const { asyncHandler } = require('../../core')
const userController = require('../../controllers/user.controller')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
})
const router = express.Router()

router.use(checkAuthentication)
router.post(
  '/upload-avatar',
  upload.single('avatar'),
  asyncHandler(userController.uploadAvatar),
)
module.exports = router
