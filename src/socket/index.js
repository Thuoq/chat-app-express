const userLoginHandler = require('./user-login')
const userLogoutHandler = require('./user-logout')
const sendMessagePrivateChat = require('./send-message-private')
const sendMessageGroupChat = require('./send-message-group')
const addMembersGroup = require('./add-members-group')
const joinGroup = require('./join-group')
const onConnection = (io, socket) => {
  userLoginHandler(io, socket)
  userLogoutHandler(io, socket)
  sendMessagePrivateChat(io, socket)
  sendMessageGroupChat(io, socket)
  addMembersGroup(io, socket)
  joinGroup(io, socket)
}
module.exports = onConnection
