const express = require('express')
const passport = require('passport')
const router = express.Router()

const userController = require('../../controllers/user-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/login', userController.getLoginPage)
router.get('/register', userController.getRegisterPage)
router.get('/email', userController.getEmailPage)
router.get('/logout', authenticated, userController.logout)
router.get('/setting', authenticated, userController.getSettingPage)
router.post('/register', userController.register)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
router.put('/setting/user', authenticated, userController.putSetting)

module.exports = router
