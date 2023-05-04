const userRepo = require('../repositories/user.repo')
class ConversationService {
  static async getListContactByUser(userId) {
    const contacts = await userRepo.getListContactByUser(userId)
    return { contacts }
  }
}
module.exports = ConversationService
