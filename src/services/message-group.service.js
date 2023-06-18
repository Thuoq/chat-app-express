const messageRepo = require('../repositories/message.repo')
class MessageGroupService {
  static async getMessagesByConversationId({ currentUserId, conversationId }) {
    const messages = await messageRepo.getListMessageByConversationId({
      currentUserId,
      conversationId,
    })
    const messagesImages = await messageRepo.getImagesFromConversation({
      conversationId,
      currentUserId,
    })
    return { messages, messagesImages }
  }
}

module.exports = MessageGroupService
