const cartController = {
  getCartPage: async (req, res, next) => {
    try {
      res.render('cart')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = cartController
