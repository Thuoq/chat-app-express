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
}
module.exports = new UserController()
