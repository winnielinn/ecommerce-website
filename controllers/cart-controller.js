const { Product } = require('../models')

const cartController = {
  getCartPage: async (req, res, next) => {
    try {
      res.render('cart')
    } catch (err) {
      console.error(err)
    }
  },
  getCheckoutPage: async (req, res, next) => {
    try {
      const { productId, productQuantityInCart } = req.body
      const products = []
      let totalPrice = 0

      for (let i = 0; i < productId.length; i++) {
        const rawProduct = await Product.findByPk(productId[i], {
          attributes: [
            'id', 'name', 'price', 'quantity'
          ]
        })

        const product = rawProduct.get({ plain: true })
        product.quantityInCart = productQuantityInCart[i]
        totalPrice += product.price * product.quantityInCart

        products.push(product)
      }

      res.render('checkout', { products, totalPrice })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = cartController
