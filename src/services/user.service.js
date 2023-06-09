const userRepo = require('../repositories/user.repo')
const messageRepo = require('../repositories/message.repo')
const { getImageUrlFromCloudinary } = require('../utils')
const { USER_STATUS_CODE } = require('../utils/constant')
const { getInfoData } = require('../utils/object')
const { NotFoundError } = require('../core/error.response')
class UserService {
  static async getUserById(userId) {
    const user = await userRepo.findUserById(userId)
    if (!user) throw new NotFoundError()
    return getInfoData({
      fields: ['id', 'name', 'email', 'avatarUrl', 'statusCode'],
      obj: user,
    })
  }
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
  static async getListUserInDb(currentUserId, { name, excludeUserIds }) {
    if (name === '') return []
    const excludeUserIdsModified = [].concat(excludeUserIds)
    excludeUserIdsModified.push(currentUserId)
    const users = await userRepo.getListUserInDb({
      excludeUserIds: excludeUserIdsModified,
      name,
    })
    return {
      users,
    }
  }
  static async getListMessagesFromTargetUser(currentUserId, targetUserId) {
    const messages = await messageRepo.getListMessagesFromTargetUserId(
      currentUserId,
      targetUserId,
    )
    const imagesMessage = await messageRepo.getImagesMessageFromTargetUserId(
      currentUserId,
      targetUserId,
    )
    return {
      messages,
      imagesMessage,
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
