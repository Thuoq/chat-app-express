const cloudinary = require('cloudinary').v2
class MessageService {
  static async generatePayload4Message({
    conversationId,
    imageUrls,
    content,
    currentUserId,
    targetUserId,
  }) {
    // handle message
    const payload = []
    if (imageUrls?.length && Array.isArray(imageUrls)) {
      for (const base64Image of imageUrls) {
        const result = await cloudinary.uploader.upload(base64Image)
        payload.push({
          conversationId,
          imageUrl: result.secure_url,
          fromUserId: currentUserId,
          toUserId: targetUserId || null,
        })
      }
    }
    if (content) {
      payload.push({
        conversationId,
        content,
        fromUserId: currentUserId,
        toUserId: targetUserId || null,
      })
    }
    return payload
  }
}
module.exports = MessageService
