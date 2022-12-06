const express = require('express')
const router = express.Router()

const productController = require('../../controllers/product-controller')

router.get('/products/:id', productController.getProduct)
router.get('/products', productController.getAllProducts)
router.get('/search', productController.searchProducts)
router.get('/home', productController.getHomePage)

module.exports = router
