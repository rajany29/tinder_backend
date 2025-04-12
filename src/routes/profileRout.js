const express = require('express')
const router = express.Router()
const {authUser} = require('../middleware/auth')
const {getUserProfile,getUserProfileEdit ,getProfileUpdatePassword} = require('../controller/profileContro')

router.get('/profile/view',authUser,getUserProfile)
router.patch('/profile/edit',authUser,getUserProfileEdit)
router.patch('/profile/password',authUser,getProfileUpdatePassword)

module.exports = router