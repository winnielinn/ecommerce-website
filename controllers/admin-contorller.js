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
  },
  getCreatePage: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        nest: true,
        raw: true
      })
      res.render('admin/create-product', { categories })
    } catch (err) {
      console.error(err)
    }
  },
  getEditPage: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const [rawProduct, categories] = await Promise.all([
        Product.findByPk(id, {
          include: [Category]
        }),
        Category.findAll({
          nest: true,
          raw: true
        })
      ])

      if (!rawProduct) {
        req.flash('error_messages', '無法查看不存在的產品。')
        return res.redirect('back')
      }

      const product = rawProduct.get({ plain: true })
      res.render('admin/edit-product', { product, categories })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
