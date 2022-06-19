const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/login', userController.getLoginPage)
router.get('/register', userController.getRegisterPage)
router.get('/logout', userController.logout)

router.get('/setting', userController.getSettingPage)

router.post('/register', userController.register)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)

module.exports = router
