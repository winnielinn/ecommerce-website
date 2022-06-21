const { Product, Category } = require('../models')

const adminController = {
  getAllProducts: async (req, res, next) => {
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
  },
  getProductPage: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const rawProduct = await Product.findByPk(id, {
        include: [Category]
      })

      if (!rawProduct) {
        req.flash('error_messages', '無法查看不存在的產品。')
        return res.redirect('back')
      }

      const product = rawProduct.get({ plain: true })

      return res.render('admin/product', { product })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
