const userService = require('../services/user.service')
const { OK } = require('../core')
const { BadRequestError } = require('../core/error.response')
const { validationResult } = require('express-validator')
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
    const excludeUserIds =
      req.query?.excludeUserIds?.split(',').map(Number) || []

    const users = await userService.getListUserInDb(currentUserId, {
      name: queryName,
      excludeUserIds,
    })
    new OK({
      metadata: users,
    }).send(res)
  }

  async updateInformation(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new BadRequestError('Invalid Name')
    const currentUserId = req.currentUser.id
    const userUpdated = await userService.updateInformation(
      currentUserId,
      req.body,
    )
    new OK({
      message: 'Update InfoUser Success',
      metadata: userUpdated,
    }).send(res)
  }
}
module.exports = new UserController()
