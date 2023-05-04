const development = {
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  },
}

const production = {
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  },
}
const configCloudinary = { production, development }
const env = process.env.NODE_ENV || 'development'

module.exports = configCloudinary[env]
