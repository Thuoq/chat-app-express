const conversationRepo = require('../repositories/conversation.repo')
const { getImageUrlFromCloudinary } = require('../utils')
const userRepo = require('../repositories/user.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class ConversationService {
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
  static async getListConversation({ currentUserId }) {
    const conversations = await conversationRepo.getListConversation({
      currentUserId,
    })
    return { conversations }
  }
  static async addMembersIntoGroup(currentUserId, conversationId, payload) {
    // check conversationId
    const conversation = await conversationRepo.findConversationById(
      conversationId,
    )
    if (!conversation) throw new NotFoundError()

    const conversationUpdated = await conversationRepo.addMembersInGroup(
      conversationId,
      payload,
    )
    return { conversation: conversationUpdated }
  }
}
module.exports = ConversationService
