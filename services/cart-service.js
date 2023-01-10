const { Product } = require('../models')

const cartService = {
  getCartPage: async (req, callback) => {
    return callback(null)
  },
  getCheckoutPage: async (req, callback) => {
    try {
      let { productId, productQuantityInCart } = req.body

      if (!productId || !productQuantityInCart) throw new Error('空的購物車無法結帳。')

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

      return callback(null, { products, totalPrice })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = cartService
