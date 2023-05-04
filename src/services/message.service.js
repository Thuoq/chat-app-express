const messageRepo = require('../repositories/message.repo')
const userRepo = require('../repositories/user.repo')
const { BadRequestError } = require('../core')
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
    const newMessage = await messageRepo.createMessageOne2One(
      currentUserId,
      body,
      conversationId,
    )
    return {
      message: newMessage,
    }
  }
}
module.exports = MessageService
