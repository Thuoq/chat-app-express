const { OK, CREATED } = require('../core')
const ConversationService = require('../services/conversation.service')
class ConversationController {
  async getAllConversationByUser(req, res, next) {
    const userId = req.currentUser.id

    new OK({
      message: 'ok',
      metadata: await ConversationService.getAllConversationByUser(userId),
    }).send(res)
  }
  async createConversationByUser(req, res, next) {
    const userId = req.currentUser.id
    new CREATED({
      message: 'ok',
      metadata: await ConversationService.createConversationByUser(
        userId,
        req.body,
      ),
    }).send(res)
  }
}

module.exports = new ConversationController()
