const _ = require('lodash/fp')
const getInfoData = ({ fields = [], obj }) => {
  return _.pick(fields, obj)
}
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}
module.exports = {
  getInfoData,
  getKeyByValue,
}
