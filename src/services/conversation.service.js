const conversationRepo = require('../repositories/conversation.repo')
const { getAvatarUrlFromCloudinary } = require('../utils')
const userRepo = require('../repositories/user.repo')
const { BadRequestError } = require('../core/error.response')
const { body } = require('express-validator')
class ConversationService {
  static async getAllConversationByUser(userId) {
    const conversations = await conversationRepo.getListConversationByUser(
      userId,
    )
    return { conversations }
  }
  static async createConversationByUser(userId, payload) {
    const conversation = await conversationRepo.createConversationByUser(
      userId,
      payload,
    )
    return {
      conversation,
    }
  }
  static async createConversation4Group(userId, payload) {
    const membersIdsParse = JSON.parse(payload.memberIds)
    if (membersIdsParse.length <= 1) throw new BadRequestError()
    const users = await userRepo.getListUserByFromIds(membersIdsParse)
    if (users.length !== membersIdsParse.length) throw new BadRequestError()
    const { avatarUrl } = await getAvatarUrlFromCloudinary(payload.bufferImage)

    const conversation = await conversationRepo.createConversation4Group({
      avatarUrl,
      name: payload.name,
      memberIds: [...membersIdsParse, userId],
    })
    return {
      conversation,
    }
  }
  static async getListConversationGroup(currentUserId) {
    const conversations = await conversationRepo.getListConversationGroupByUser(
      currentUserId,
    )
    return { conversations }
  }
}
module.exports = ConversationService
