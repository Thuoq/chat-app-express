const nodemailer = require('nodemailer')
class EmailService {
  static async getTransporter() {
    const testAccount = await nodemailer.createTestAccount()

    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    })
  }
  static async sendMail(context) {
    const transporter = await EmailService.getTransporter()

    return transporter.sendMail(context)
  }
}

module.exports = EmailService
