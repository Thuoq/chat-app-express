const messageRepo = require('../repositories/message.repo')
const messageService = require('./message.service')
const conversationRepo = require('../repositories/conversation.repo')
const { NotFoundError } = require('../core/error.response')
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
  static async addMembersIntoGroup(conversationId, payload) {
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

module.exports = MessageGroupService
