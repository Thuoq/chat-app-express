const { OK, CREATED } = require('../core')
const MessageService = require('../services/message.service')
class MessageController {
  async getMessagesByConversationId(req, res, next) {
    const { isDirectMessage } = req.query
    const conversationId = Number(req.params.id)
    const currentUserId = req.currentUser.id
    const metadata = await MessageService.getMessagesByConversationId({
      currentUserId,
      conversationId,
      isDirectMessage,
    })
    new OK({
      metadata,
    }).send(res)
  }
  async createMessageByConversationId(req, res, next) {
    const conversationId = Number(req.params.id)
    const currentUserId = req.currentUser.id
    const metadata = await MessageService.createMessage(
      {
        conversationId,
        currentUserId,
      },
      req.body,
    )
    new CREATED({
      metadata,
    }).send(res)
  }
  async getMessageImageByConversationId(req, res, next) {
    const conversationId = Number(req.params.id)
    const isDirectMessage = req.query.isDirectMessage
    const metadata = await MessageService.getImagesMessageByConversation({
      conversationId,
      isDirectMessage,
    })
    new OK({
      metadata,
    }).send(res)
  }
}

module.exports = new MessageController()
