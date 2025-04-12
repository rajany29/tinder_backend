const express = require('express')
const router = express.Router()
const {authUser} = require('../middleware/auth')
const {getUserRequest , getUserConnection , feed} = require('../controller/userContro')

router.get('/user/requests/received',authUser,getUserRequest)
router.get('/user/connections',authUser,getUserConnection)
router.get('/feed',authUser,feed)

module.exports = router