const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/login', userController.getLoginPage)
router.get('/register', userController.getRegisterPage)
router.post('/register', userController.register)

module.exports = router
