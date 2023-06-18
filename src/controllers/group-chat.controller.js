const { BadRequestError } = require('../core/error.response')
const MessageGroupService = require('../services/message-group.service')
const { OK } = require('../core')

class GroupChatController {
  async getListMessageFromConversationId(req, res, next) {
    const currentUserId = req.currentUser.id
    const conversationId = Number(req.params.id)
    if (!conversationId) throw new BadRequestError()

    const metadata = await MessageGroupService.getMessagesByConversationId({
      conversationId,
      currentUserId,
    })
    new OK({ metadata }).send(res)
  }
}

module.exports = new GroupChatController()
