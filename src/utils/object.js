const _ = require('lodash/fp')
const getInfoData = ({ fields = [], obj }) => {
  return _.pick(fields, obj)
}

module.exports = {
  getInfoData,
}
