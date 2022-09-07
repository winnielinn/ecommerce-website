const express = require('express')
const router = express.Router()

const apiService = require('../../services/api-service')

router.get('/cartItems', apiService.getProductsInCart)
router.get('/cartItem', apiService.getProductInCart)

module.exports = router
