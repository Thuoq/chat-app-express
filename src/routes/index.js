const express = require('express')
const router = express.Router()
const { checkAuthentication } = require('../utils')
router.use('/auth', require('./auth'))
router.use(checkAuthentication)
router.use('/conversations', require('./conversation'))
router.use('/users', require('./user'))
module.exports = router
