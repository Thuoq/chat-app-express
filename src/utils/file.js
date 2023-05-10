const cloudinary = require('cloudinary').v2
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
})

const uploadOptions = {
  resource_type: 'image',
  folder: 'avatars',
}
const writeFile = util.promisify(fs.writeFile)
const getImageUrlFromCloudinary = async (imageBuffer, currentUserId = 0) => {
  const tempFilePath = path.join(os.tmpdir(), `avatar_${currentUserId}.jpg`)
  await writeFile(tempFilePath, imageBuffer)

  const uploadResult = await cloudinary.uploader.upload(
    tempFilePath,
    uploadOptions,
  )
  fs.unlinkSync(tempFilePath)
  return { imageUrl: uploadResult.secure_url }
}

module.exports = {
  getImageUrlFromCloudinary,
  uploadFile: upload,
}
