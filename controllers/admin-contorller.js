const { Product, Category } = require('../models')

const { localFileHandler } = require('../helpers/file-helper')

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
  postProduct: async (req, res, next) => {
    try {
      const { name, categoryId, price, weight, quantity, description } = req.body

      if (!name || !categoryId || !price || !weight) {
        req.flash('error_messages', '* 為必填欄位。')
        return res.redirect('back')
      }

      const { file } = req
      const filePath = await localFileHandler(file)
      console.log()

      await Product.create({
        name,
        CategoryId: categoryId,
        price,
        weight,
        quantity,
        image: filePath || null,
        description
      })

      req.flash('success_messages', `${name} 已經新增成功。`)
      return res.redirect('/admin/products')
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
