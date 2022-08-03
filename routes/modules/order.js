const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order-controller')

router.get('/', orderController.getOrders)
router.get('/:id', orderController.getOrder)

module.exports = router
