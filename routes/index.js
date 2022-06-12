const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')

router.use('/', home)

module.exports = router
