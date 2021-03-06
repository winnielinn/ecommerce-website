const express = require('express')
const router = express.Router()

const upload = require('../../middleware/mutler')

const adminController = require('../../controllers/admin-contorller')
const categoryController = require('../../controllers/category-controller')

// products
router.get('/products/create', adminController.getCreatePage)
router.get('/products/:id/edit', adminController.getEditPage)
router.get('/products/:id', adminController.getProductPage)
router.get('/products', adminController.getAllProducts)
router.post('/products', upload.single('image'), adminController.postProduct)
router.put('/products/:id', upload.single('image'), adminController.editProduct)
router.delete('/products/:id', adminController.deleteProduct)

// users
router.get('/users', adminController.getUsersPage)

// categories
router.get('/categories/:id', categoryController.getCategoriesPage)
router.get('/categories', categoryController.getCategoriesPage)
router.put('/categories/:id', categoryController.putCategory)
router.post('/categories', categoryController.postCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

// orders
router.get('/orders', adminController.getOrdersPage)
router.get('/orders/:id', adminController.getOrderPage)
router.put('/orders/:id', adminController.putOrder)
router.post('/orders/:id/cancel', adminController.cancelOrder)

router.get('/', (req, res) => res.redirect('/admin/products'))

module.exports = router
