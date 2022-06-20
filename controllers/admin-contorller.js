const { Product, Category } = require('../models')

const adminController = {
  getProductPage: async (req, res, next) => {
    try {
      const products = await Product.findAll({
        include: [Category],
        nest: true,
        raw: true
      })

      return res.render('admin/products', { products })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
