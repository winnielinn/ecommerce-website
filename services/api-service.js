const { Product } = require('../models')

const apiService = {
  getProductsInCart: async (req, res, next) => {
    try {
      const productIdsInArray = req.query.productIds.split(',')

      const cartItems = []

      for (let i = 0; i < productIdsInArray.length; i++) {
        const product = await Product.findOne({
          where: {
            id: parseInt(productIdsInArray[i], 10)
          },
          attributes: [
            'name', 'price', 'quantity', 'image'
          ]
        })
        cartItems.push(product.get({ plain: true }))
      }

      console.log(cartItems)
      return res.json(cartItems)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = apiService
