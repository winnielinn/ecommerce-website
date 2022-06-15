const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/login', userController.getLoginPage)
router.get('/register', userController.getRegisterPage)

router.post('/register', userController.register)
router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }), userController.login)

module.exports = router
