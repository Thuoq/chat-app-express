const cloudinary = require('cloudinary').v2
const userRepo = require('../repositories/user.repo')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')
const { getAvatarUrlFromCloudinary } = require('../utils')
const writeFile = util.promisify(fs.writeFile)
class UserService {
  static async uploadAvatar(currentUserId, imageBuffer) {
    const { avatarUrl, tempFilePath } = await getAvatarUrlFromCloudinary(
      imageBuffer,
    )
    const userUpdated = await userRepo.updateUserByPayload(currentUserId, {
      avatarUrl,
    })

    fs.unlinkSync(tempFilePath)
    return { user: userUpdated }
  }
}
module.exports = UserService
