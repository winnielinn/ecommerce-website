const { Category, Product } = require('../models')

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
  },
  getAllProducts: async (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    const [products, categories] = await Promise.all([
      await Product.findAll({
        included: Category,
        where: {
          ...categoryId ? { CategoryId: categoryId } : {}
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])

    return res.render('products', { products, categories, categoryId })
  },
  getProduct: async (req, res, next) => {
    try {
      const id = Number(req.params.id)

      const [rawProduct, categories] = await Promise.all([
        Product.findByPk(id),
        Category.findAll({
          raw: true
        })
      ])

      if (!rawProduct) {
        req.flash('error_messages', '無法查看不存在的產品。')
        return res.redirect('back')
      }

      await rawProduct.increment('view_counts')

      const product = rawProduct.get({ plain: true })
      const categoryId = product.CategoryId

      return res.render('product', { product, categories, categoryId })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = productController
