const development = {
  app: {
    port: process.env.PORT,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    databaseName: process.env.MONGO_DB_NAME,
  },
}

const production = {
  app: {
    port: process.env.PORT,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    databaseName: process.env.MONGO_DB_NAME,
  },
}
const config = { production, development }
const env = process.env.NODE_ENV || 'development'

module.exports = config[env]
