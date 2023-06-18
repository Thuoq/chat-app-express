const { OK, CREATED, BadRequestError } = require('../core')
const ConversationService = require('../services/conversation.service')
const { validationResult } = require('express-validator')
class ConversationController {
  /*
   * @body: {members: [], name: string,  avatar: string}
   * */
  async createConversation4Group(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    const bufferImage = req.file.buffer
    const currentUserId = req.currentUser.id
    new CREATED({
      metadata: await ConversationService.createConversation4Group(
        currentUserId,
        { ...req.body, bufferImage },
      ),
    }).send(res)
  }
  async getListConversations(req, res, next) {
    const currentUserId = req.currentUser.id
    const metadata = await ConversationService.getListConversation({
      currentUserId,
    })

    new OK({
      metadata,
    }).send(res)
  }
  async addMembersIntoGroup(req, res, next) {
    const currentUserId = req.currentUser.id
    const conversationId = Number(req.params.id)

    const metadata = await ConversationService.addMembersIntoGroup(
      currentUserId,
      conversationId,
      req.body.memberIds,
    )

    new OK({
      metadata,
    }).send(res)
  }
}

module.exports = new ConversationController()
