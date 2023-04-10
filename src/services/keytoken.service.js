const keyTokenRepo = require('../repositories/keytoken.repo')
const { BadRequestError } = require('../core')
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    refreshToken,
    publicKey,
    privateKey,
  }) => {
    const keyToken = await this.findKeyTokenByUserId(userId)
    if (keyToken) {
      throw new BadRequestError('User already login')
    }
    return keyTokenRepo.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken,
    })
  }
  static findKeyTokenByUserId(userId) {
    return keyTokenRepo.findKeyTokenByUserId(userId)
  }
  static removeKeyTokenByUserId(userId) {
    return keyTokenRepo.removeKeyTokenByUserId(userId)
  }
  static updateKeyTokenByUserId(userId, payload) {
    return keyTokenRepo.updateKeyTokenByUserId(userId, payload)
  }
}

module.exports = KeyTokenService
