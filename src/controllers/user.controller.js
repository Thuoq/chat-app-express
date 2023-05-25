const userService = require('../services/user.service')
const { OK } = require('../core')
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
}
module.exports = new UserController()
