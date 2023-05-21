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
    console.log('body:: ', req.body, bufferImage)
    new CREATED({
      metadata: await ConversationService.createConversation4Group(
        currentUserId,
        { ...req.body, bufferImage },
      ),
    }).send(res)
  }
  async getListConversationGroupByUser(req, res, next) {
    const currentUserId = req.currentUser.id
    new OK({
      metadata: await ConversationService.getListConversationGroup(
        currentUserId,
      ),
    }).send(res)
  }
  async getListMessagesGroupByMember(req, res, next) {
    const currentUserId = req.currentUser.id
  }
}

module.exports = new ConversationController()
