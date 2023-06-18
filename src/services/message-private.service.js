const messageRepo = require('../repositories/message.repo')
const messageService = require('../services/message.service')
const userRepo = require('../repositories/user.repo')
const { getInfoData } = require('../utils/object')
class MessagePrivateService {
  static async createMessage({
    imageUrls,
    content,
    currentUserId,
    targetUserId,
  }) {
    const payload = await messageService.generatePayload4Message({
      imageUrls,
      content,
      currentUserId,
      targetUserId,
      conversationId: undefined,
    })
    await messageRepo.createMessages({
      payload,
    })
    const messages = await this.getMessages({
      targetUserId,
      currentUserId,
    })
    return {
      ...messages,
    }
  }
  static async getMessages({ targetUserId, currentUserId }) {
    const [messages, messagesImages] = await Promise.all([
      messageRepo.getListMessageOne2One({
        currentUserId,
        targetUserId,
      }),
      messageRepo.getImagesMessageFromTargetUserId({
        currentUserId,
        targetUserId,
      }),
    ])
    return {
      messagesImages,
      messages,
    }
  }
  static async getUsersRecentlyChat(currentUserId) {
    const users = await userRepo.getRecentUsersChatById(currentUserId)
    return {
      users: users.map((user) =>
        getInfoData({
          fields: ['id', 'name', 'email', 'avatarUrl', 'statusCode'],
          obj: user,
        }),
      ),
    }
  }
  static async handleSendMessage({ senderId, targetUserId, ...payload }) {}
}

module.exports = MessagePrivateService
