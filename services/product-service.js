const { Op } = require('sequelize')
const { Category, Product } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

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
      const DEFAULT_LIMIT = 9

      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT

      const offset = getOffset(limit, page)
      const category = true

      const [products, categories] = await Promise.all([
        await Product.findAndCountAll({
          included: Category,
          limit,
          offset,
          where: {
            ...categoryId ? { CategoryId: categoryId } : {}
          },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      return callback(null, { products: products.rows, categories, categoryId, category, pagination: getPagination(limit, page, products.count) })
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
  },
  searchProducts: async (req, callback) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT

      const searchWords = req.query.searchWords.replace(/\s+/g, '')
      const offset = getOffset(limit, page)
      const category = true

      const [products, categories] = await Promise.all([
        Product.findAndCountAll({
          offset,
          limit,
          where: {
            name: {
              [Op.substring]: searchWords
            }
          },
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      return callback(null, { products: products.rows, categories, category, searchWords, pagination: getPagination(limit, page, products.count) })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = productService
