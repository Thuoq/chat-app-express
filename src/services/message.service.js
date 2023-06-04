const messageRepo = require('../repositories/message.repo')
const conversationRepo = require('../repositories/conversation.repo')
const { NotFoundError } = require('../core')
const cloudinary = require('cloudinary').v2
class MessageService {
  static async getMessagesByConversationId({
    currentUserId,
    conversationId,
    isDirectMessage,
  }) {
    const messages = await messageRepo.getListMessageByConversationId({
      currentUserId,
      conversationId,
      isDirectMessage,
    })
    return { messages }
  }

  static async createMessage(
    { currentUserId, conversationId: conversationIdPayload },
    body,
  ) {
    let conversationId = conversationIdPayload
    if (isNaN(conversationId)) {
      const newConversation = await conversationRepo.createConversationOne2One()
      conversationId = newConversation.id
    } else {
      const conversation = await conversationRepo.findConversationById(
        conversationIdPayload,
      )
      if (!conversation) throw new NotFoundError('conversation not found')
    }
    // handle message
    const payload = []
    if (body.imageUrls?.length && Array.isArray(body.imageUrls)) {
      for (const base64Image of body.imageUrls) {
        const result = await cloudinary.uploader.upload(base64Image)
        payload.push({
          conversationId,
          imageUrl: result.secure_url,
          fromUserId: currentUserId,
          toUserId: body.targetUserId || null,
        })
      }
    }
    if (body.content) {
      payload.push({
        conversationId,
        content: body.content,
        fromUserId: currentUserId,
        toUserId: body.targetUserId || null,
      })
    }
    await messageRepo.createMessages({
      payload,
    })
    return true
  }
}
module.exports = MessageService
