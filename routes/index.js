const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')
const user = require('./modules/user.js')

router.use('/user', user)

router.use('/', home)

module.exports = router
