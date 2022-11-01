const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/:id/payment', orderController.getPayment)
router.get('/:id', orderController.getOrder)
router.get('/', orderController.getOrders)
router.post('/', authenticated, orderController.postOrder)

module.exports = router