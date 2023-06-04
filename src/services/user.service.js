const userRepo = require('../repositories/user.repo')
const messageRepo = require('../repositories/message.repo')
const { getImageUrlFromCloudinary } = require('../utils')
const { USER_STATUS_CODE } = require('../utils/constant')
const { getInfoData } = require('../utils/object')
class UserService {
  static async uploadAvatar(currentUserId, imageBuffer) {
    const { imageUrl } = await getImageUrlFromCloudinary(imageBuffer)
    const userUpdated = await userRepo.updateUserByPayload(currentUserId, {
      avatarUrl: imageUrl,
    })

    return { user: userUpdated }
  }
  static async getListUserOnline() {
    const users = await userRepo.getListUserByStatusCode(
      USER_STATUS_CODE.ONLINE.label,
    )
    return {
      users,
    }
  }
  static async getListUserInDb(currentUserId, query) {
    if (query && query.name === '') return []
    const users = await userRepo.getListUserInDb(currentUserId, query)
    return {
      users,
    }
  }
  static async getListMessagesFromTargetUser(currentUserId, targetUserId) {
    const messages = await messageRepo.getListMessagesFromTargetUserId(
      currentUserId,
      targetUserId,
    )
    return {
      messages,
    }
  }
  static async updateInformation(currentUserId, { name, statusCode }) {
    const updatedUser = await userRepo.updateUserByPayload(currentUserId, {
      name,
      statusCode,
    })
    return {
      user: getInfoData({
        fields: ['id', 'name', 'email', 'avatarUrl', 'statusCode'],
        obj: updatedUser,
      }),
    }
  }
}
module.exports = UserService
