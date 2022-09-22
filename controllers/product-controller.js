const productService = require('../services/product-service')

const productController = {
  getHomePage: async (req, res, next) => {
    productService.getHomePage(req, (err, data) => err ? next(err) : res.render('home', data))
  },
  getAllProducts: async (req, res, next) => {
    productService.getAllProducts(req, (err, data) => err ? next(err) : res.render('products', data))
  },
  getProduct: async (req, res, next) => {
    productService.getProduct(req, (err, data) => err ? next(err) : res.render('product', data))
  }
}

module.exports = productController
