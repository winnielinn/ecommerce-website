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

// categories
router.get('/categories/:id', categoryController.getCategoriesPage)
router.get('/categories', categoryController.getCategoriesPage)
router.put('/categories/:id', categoryController.putCategory)
router.post('/categories', categoryController.postCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/', (req, res) => res.redirect('/admin/products'))

module.exports = router
