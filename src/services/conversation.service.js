const conversationRepo = require('../repositories/conversation.repo')

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
}
module.exports = ConversationService
