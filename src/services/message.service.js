const messageRepo = require('../repositories/message.repo')
const userRepo = require('../repositories/user.repo')
const conversationRepo = require('../repositories/conversation.repo')
const { BadRequestError, NotFoundError } = require('../core')
const { getImageUrlFromCloudinary } = require('../utils/file')
const cloudinary = require('cloudinary').v2
class MessageService {
  static async getListMessageOne2One(currentUserId, targetUserId) {
    // check target user exits

    const user = await userRepo.findUserById(targetUserId)
    if (!user) throw new BadRequestError()
    const messages = await messageRepo.getListMessageOne2One(
      currentUserId,
      targetUserId,
    )
    return {
      messages,
    }
  }
  static async sendMessage2One(currentUserId, body) {
    const targetUserId = body.targetUserId
    // check send messages before ?
    const messageBefore = await messageRepo.getOneMessageOne2One(
      currentUserId,
      targetUserId,
    )

    const conversationId = messageBefore?.conversationId || null
    // check have images
    if (body.imageUrls?.length && Array.isArray(body.imageUrls)) {
      // get base 64 : todo: improve promise all
      const payloadUploadImage = []
      for (const base64Image of body.imageUrls) {
        const result = await cloudinary.uploader.upload(base64Image)
        payloadUploadImage.push({ imageUrl: result.secure_url, targetUserId })
      }
      await messageRepo.createMessageOne2OneWhenImage(
        currentUserId,
        payloadUploadImage,
        conversationId,
      )
    }
    if (body.content) {
      await messageRepo.createMessageOne2One(
        currentUserId,
        body,
        conversationId,
      )
    }
    return true
  }
  static async sendMessage2Group(conversationId, currentUserId, body) {
    const conversation = await conversationRepo.findConversationGroupById(
      conversationId,
      currentUserId,
    )
    if (!conversation) throw new NotFoundError()

    const newMessage = await messageRepo.createMessage4Group(
      currentUserId,
      conversationId,
      body,
    )
    return {
      message: newMessage,
    }
  }
  static async handleUploadImage(imageBuffer) {
    const { imageUrl } = await getImageUrlFromCloudinary(imageBuffer)
    return {
      imageUrl,
    }
  }
  static async getListMessage4Group(memberId, conversationId) {
    const messages = await messageRepo.getListMessageGroupByMember(
      memberId,
      conversationId,
    )
    return {
      messages,
    }
  }
}
module.exports = MessageService
