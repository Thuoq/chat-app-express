const express = require('express')
const router = express.Router()

router.use('/conversations', require('./conversation'))
router.use('/auth', require('./auth'))
router.use('/contacts', require('./contact'))

module.exports = router
