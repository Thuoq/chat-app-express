const userRepo = require('../repositories/user.repo')
const { getImageUrlFromCloudinary } = require('../utils')
class UserService {
  static async uploadAvatar(currentUserId, imageBuffer) {
    const { imageUrl } = await getImageUrlFromCloudinary(imageBuffer)
    const userUpdated = await userRepo.updateUserByPayload(currentUserId, {
      avatarUrl: imageUrl,
    })

    return { user: userUpdated }
  }
}
module.exports = UserService
