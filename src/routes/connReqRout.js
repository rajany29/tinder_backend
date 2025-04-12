const express = require('express')
const router = express.Router()
const {authUser} = require('../middleware/auth')
const {connectionRequestIntersted,connectionAcceptedRejected} = require('../controller/connRequestContro')

router.post('/request/send/:status/:userId',authUser,connectionRequestIntersted)
router.post('/request/review/:status/:requestId',authUser,connectionAcceptedRejected)
module.exports = router