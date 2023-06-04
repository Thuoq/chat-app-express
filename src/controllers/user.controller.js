const userService = require('../services/user.service')
const { OK } = require('../core')
const { BadRequestError } = require('../core/error.response')
class UserController {
  async uploadAvatar(req, res, next) {
    const bufferImage = req.file.buffer
    const currentUserId = req.currentUser.id
    const userUpdated = await userService.uploadAvatar(
      currentUserId,
      bufferImage,
    )
    new OK({
      message: 'Update avatar success fully',
      metadata: userUpdated,
    }).send(res)
  }
  async getListUserOnline(req, res, next) {
    const currentUserId = req.currentUser.id
    const users = await userService.getListUserOnline()
    new OK({
      message: 'Get Users Online success fully',
      metadata: users,
    }).send(res)
  }

  async getListUserInDb(req, res, next) {
    const currentUserId = req.currentUser.id
    const queryName = req.query.name
    const users = await userService.getListUserInDb(currentUserId, {
      name: queryName,
    })
    new OK({
      metadata: users,
    }).send(res)
  }
  async getListMessagesFromTargetUser(req, res, next) {
    const currentUserId = req.currentUser.id
    const targetUserId = Number(req.params.targetUserId)
    if (!targetUserId) throw new BadRequestError()

    const messages = await userService.getListMessagesFromTargetUser(
      currentUserId,
      targetUserId,
    )
    new OK({ metadata: messages }).send(res)
  }
}
module.exports = new UserController()
