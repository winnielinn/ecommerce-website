const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const user = require('./modules/user')
const admin = require('./modules/admin')
const order = require('./modules/order')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/users', user)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/orders', authenticated, order)
router.use('/', home)

router.get('/', (req, res) => res.redirect('/home'))

module.exports = router
