const { OK, CREATED, BadRequestError } = require('../core')
const MessageService = require('../services/message.service')
const { validationResult } = require('express-validator')
const ConversationService = require('../services/conversation.service')
class MessageController {
  async sendMessage2One(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    const currentUserId = req.currentUser?.id
    const body = req.body
    const newMessage = await MessageService.sendMessage2One(currentUserId, body)
    new CREATED({
      metadata: newMessage,
    }).send(res)
  }
  async sendMessage2Group(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    const currentUserId = req.currentUser?.id
    const conversationId = Number(req.params.conversationId)
    const body = req.body
    const newMessage = await MessageService.sendMessage2Group(
      conversationId,
      currentUserId,
      body,
    )
    new CREATED({
      metadata: newMessage,
    }).send(res)
  }
  async handleUploadImage(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Input Invalid !')
    // const currentUserId = req.currentUser?.id
    const bufferImage = req.file.buffer
    new OK({
      metadata: await MessageService.handleUploadImage(bufferImage),
    }).send(res)
  }
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
}

module.exports = new MessageController()
