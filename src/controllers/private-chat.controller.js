const { BadRequestError } = require('../core/error.response')
const MessagePrivateService = require('../services/message-private.service')
const { OK } = require('../core')

class PrivateChatController {
  async getListMessagesFromTargetUser(req, res, next) {
    const currentUserId = req.currentUser.id
    const targetUserId = Number(req.params.targetUserId)
    if (!targetUserId) throw new BadRequestError()

    const metadata = await MessagePrivateService.getMessages({
      targetUserId,
      currentUserId,
    })
    new OK({ metadata }).send(res)
  }
  async getListUsersRecentlyChat(req, res, next) {
    const currentUserId = req.currentUser.id

    const metadata = await MessagePrivateService.getUsersRecentlyChat(
      currentUserId,
    )
    new OK({ metadata }).send(res)
  }
}

module.exports = new PrivateChatController()
