const { Category, Product } = require('../models')

const productService = {
  getHomePage: async (req, callback) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      const category = true

      return callback(null, { categories, category })
    } catch (err) {
      return callback(err)
    }
  },
  getAllProducts: async (req, callback) => {
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

      return callback(null, { products, categories, categoryId, category })
    } catch (err) {
      return callback(err)
    }
  },
  getProduct: async (req, callback) => {
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

      return callback(null, { product, categories, categoryId, category })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = productService
