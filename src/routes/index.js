const express = require('express')
const router = express.Router()

router.use('/conversations', require('./conversation'))
router.use('/auth', require('./auth'))
router.use('/messages', require('./message'))
router.use('/users', require('./user'))
module.exports = router
