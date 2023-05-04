const express = require('express')
const { checkAuthentication } = require('../../utils/auth')
const { asyncHandler } = require('../../core')
const contactController = require('../../controllers/contact.controller')
const router = express.Router()
// CHECK AUTHENTICATION
router.use(checkAuthentication)
// CONTACT
router.get('/', asyncHandler(contactController.getListContact))
module.exports = router
