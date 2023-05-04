const { OK, CREATED, BadRequestError } = require('../core')
const MessageService = require('../services/message.service')
const { validationResult } = require('express-validator')
class MessageController {
  async getListMessageOne2One(req, res, next) {
    const currentUserId = req.currentUser?.id

    const targetUserId = Number(req.query?.targetUserId)

    const messages = await MessageService.getListMessageOne2One(
      currentUserId,
      targetUserId,
    )
    new OK({
      metadata: messages,
    }).send(res)
  }

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
}

module.exports = new MessageController()
