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

    console.log(categoryId)

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
  }
}

module.exports = productController
