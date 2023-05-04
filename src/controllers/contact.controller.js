const contactService = require('../services/contact.service')
const { OK } = require('../core')
class ContactController {
  async getListContact(req, res, next) {
    const userId = req.currentUser.id
    const contacts = await contactService.getListContactByUser(userId)
    new OK({
      message: 'ok',
      metadata: contacts,
    }).send(res)
  }
}
module.exports = new ContactController()
