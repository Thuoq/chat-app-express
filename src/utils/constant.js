const CONVERSATION_TYPE = {
  directMessage: 1,
  group: 2,
}
const USER_STATUS_CODE = {
  ONLINE: {
    value: 1,
    label: 'ONLINE',
  },
  BUSY: {
    value: 2,
    label: 'BUSY',
  },
  AWAY: {
    value: 3,
    label: 'AWAY',
  },
  OFFLINE: {
    value: 4,
    label: 'OFFLINE',
  },
}
module.exports = {
  CONVERSATION_TYPE,
  USER_STATUS_CODE,
}
