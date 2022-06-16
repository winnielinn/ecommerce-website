const { Category } = require('../models')

const productController = {
  getHomePage: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })

      return res.render('home', { categories })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = productController
