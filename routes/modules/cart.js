const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cart-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/', cartController.getCartPage)
router.post('/', authenticated, cartController.getCheckoutPage)

module.exports = router
