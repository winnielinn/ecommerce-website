const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/', orderController.getOrders)
router.get('/:id', orderController.getOrder)
router.post('/', authenticated, orderController.postOrder)

module.exports = router
