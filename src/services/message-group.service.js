const messageRepo = require('../repositories/message.repo')
const messageService = require('./message.service')
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
  static async createMessage(body) {
    const { conversationId, imageUrls, content, currentUserId } = body
    const payload = await messageService.generatePayload4Message({
      currentUserId,
      imageUrls,
      content,
      targetUserId: null,
      conversationId,
    })
    await messageRepo.createMessages({
      payload,
    })

    return await this.getMessagesByConversationId({
      currentUserId,
      conversationId,
    })
  }
}

module.exports = MessageGroupService
