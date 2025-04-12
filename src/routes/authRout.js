const express = require('express')
const router = express.Router()
const {register , login, logout} = require('../controller/authContro')

router.post('/signup',register)
router.post('/login',login)
router.post('/logout',logout)

module.exports = router