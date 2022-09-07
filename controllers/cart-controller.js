const { Product } = require('../models')

const cartController = {
  getCartPage: async (req, res, next) => {
    try {
      res.render('cart')
    } catch (err) {
      next(err)
    }
  },
  getCheckoutPage: async (req, res, next) => {
    try {
      let { productId, productQuantityInCart } = req.body

      if (!productId) return

      const productIdArray = []
      const products = []
      productIdArray.push(productId)

      productId = (typeof productId === 'string') ? productIdArray : productId

      let totalPrice = 0

      for (let i = 0; i < productId.length; i++) {
        const rawProduct = await Product.findByPk(productId[i], {
          attributes: [
            'id', 'name', 'price', 'quantity'
          ]
        })

        const product = rawProduct.get({ plain: true })

        if (typeof productQuantityInCart === 'string') {
          product.quantityInCart = productQuantityInCart
        } else {
          product.quantityInCart = productQuantityInCart[i]
        }

        totalPrice += product.price * product.quantityInCart

        products.push(product)
      }

      res.render('users/checkout', { products, totalPrice })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController
