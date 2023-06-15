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
    const messagesImages = await messageRepo.getImagesFromConversation({
      conversationId,
      isDirectMessage,
      currentUserId,
    })
    return { messages, messagesImages }
  }

  static async createMessage(
    { currentUserId, conversationId: conversationIdPayload, isDirectMessage },
    body,
  ) {
    let conversationId = conversationIdPayload
    if (!conversationIdPayload) {
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

    return {
      ...(await this.getMessagesByConversationId({
        currentUserId,
        conversationId,
        isDirectMessage,
      })),
      conversationId,
    }
  }

  static async getImagesMessageByConversation(payload) {
    const messagesImages = await messageRepo.getImagesFromConversation(payload)

    return {
      messagesImages,
    }
  }

  static async generatePayload4Message({
    conversationId,
    imageUrls,
    content,
    currentUserId,
    targetUserId,
  }) {
    // handle message
    const payload = []
    if (imageUrls?.length && Array.isArray(imageUrls)) {
      for (const base64Image of imageUrls) {
        const result = await cloudinary.uploader.upload(base64Image)
        payload.push({
          conversationId,
          imageUrl: result.secure_url,
          fromUserId: currentUserId,
          toUserId: targetUserId || null,
        })
      }
    }
    if (content) {
      payload.push({
        conversationId,
        content,
        fromUserId: currentUserId,
        toUserId: targetUserId || null,
      })
    }
    return payload
  }
}
module.exports = MessageService
