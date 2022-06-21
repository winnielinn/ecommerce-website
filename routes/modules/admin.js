const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-contorller')

router.get('/products', adminController.getAllProducts)
router.get('/products/:id', adminController.getProductPage)

router.get('/', (req, res) => res.redirect('/admin/products'))

module.exports = router
