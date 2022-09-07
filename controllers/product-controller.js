const { Category, Product } = require('../models')

const productController = {
  getHomePage: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      const category = true
      return res.render('home', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  getAllProducts: async (req, res, next) => {
    try {
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

      const category = true

      return res.render('products', { products, categories, categoryId, category })
    } catch (err) {
      next(err)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const id = Number(req.params.id)

      let [product, categories] = await Promise.all([
        Product.findByPk(id),
        Category.findAll({
          raw: true
        })
      ])

      if (!product) throw new Error('無法查看不存在的商品。')

      await product.increment('view_counts')

      product = product.get({ plain: true })
      const categoryId = product.CategoryId
      const category = true

      return res.render('product', { product, categories, categoryId, category })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController
