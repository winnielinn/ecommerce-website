const cartService = require('../services/cart-service')

const cartController = {
  getCartPage: async (req, res, next) => {
    cartService.getCartPage(req, (err, _data) => err ? next(err) : res.render('cart'))
  },
  getCheckoutPage: async (req, res, next) => {
    cartService.getCheckoutPage(req, (err, data) => err ? next(err) : res.render('users/checkout', data))
  }
}

module.exports = cartController
