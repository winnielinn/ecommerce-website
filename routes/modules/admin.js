const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-contorller')

router.get('/products/create', adminController.getCreatePage)
router.get('/products/:id/edit', adminController.getEditPage)
router.get('/products/:id', adminController.getProductPage)
router.get('/products', adminController.getAllProducts)

router.get('/', (req, res) => res.redirect('/admin/products'))

module.exports = router
