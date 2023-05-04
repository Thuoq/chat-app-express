const cloudinary = require('cloudinary').v2
const userRepo = require('../repositories/user.repo')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const cloudinaryConfig = require('../config/config.cloudinary')

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudinary.cloudName,
  api_key: cloudinaryConfig.cloudinary.apiKey,
  api_secret: cloudinaryConfig.cloudinary.apiSecret,
})
class UserService {
  static async uploadAvatar(currentUserId, imageBuffer) {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'avatars',
    }

    const tempFilePath = path.join(os.tmpdir(), `avatar_${currentUserId}.jpg`)
    await writeFile(tempFilePath, imageBuffer)

    const uploadResult = await cloudinary.uploader.upload(
      tempFilePath,
      uploadOptions,
    )

    const imageUrl = uploadResult.secure_url
    const userUpdated = await userRepo.updateUserByPayload(currentUserId, {
      avatarUrl: imageUrl,
    })

    fs.unlinkSync(tempFilePath)
    return { user: userUpdated }
  }
}
module.exports = UserService
