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
            'id', 'name', 'price', 'quantity', 'image'
          ]
        })
        cartItems.push(product.get({ plain: true }))
      }

      return res.json(cartItems)
    } catch (err) {
      console.error(err)
    }
  },
  getProductInCart: async function (req, res, next) {
    const id = Number(req.query.productId)
    const rawProduct = await Product.findByPk(id, {
      attributes: [
        'id', 'price', 'quantity'
      ]
    })
    const product = rawProduct.get({ plain: true })

    res.json(product)
  }
}

module.exports = apiService
