const conversationRepo = require('../repositories/conversation.repo')
const { getImageUrlFromCloudinary } = require('../utils')
const userRepo = require('../repositories/user.repo')
const { BadRequestError } = require('../core/error.response')
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
    const membersIdsParse = payload.memberIds.split(',').map(Number)
    if (membersIdsParse.length <= 1) throw new BadRequestError()

    const users = await userRepo.getListUserByFromIds(membersIdsParse)
    if (users.length !== membersIdsParse.length) throw new BadRequestError()
    const { imageUrl } = await getImageUrlFromCloudinary(
      payload.bufferImage,
      userId,
    )

    const conversation = await conversationRepo.createConversation4Group({
      avatarUrl: imageUrl,
      name: payload.name,
      memberIds: [...membersIdsParse, userId],
    })
    return {
      conversation,
    }
  }
  static async getListConversation({ currentUserId, isDirectMessage }) {
    const conversations = await conversationRepo.getListConversation({
      currentUserId,
      isDirectMessage,
    })
    return { conversations }
  }
}
module.exports = ConversationService
