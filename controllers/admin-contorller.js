const { Product, Category } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helper')

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
      const filePath = await imgurFileHandler(file)

      await Product.create({
        name,
        CategoryId: categoryId,
        price,
        weight,
        quantity,
        image: filePath || null,
        description
      })

      req.flash('success_messages', `已經成功新增 ${name} 這個商品。`)
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
  },
  editProduct: async (req, res, next) => {
    try {
      const id = req.params.id
      const { file } = req
      const { name, categoryId, price, weight, quantity, description } = req.body

      if (!name || !categoryId || !price || !weight) {
        req.flash('error_messages', '* 為必填欄位。')
        return res.redirect('back')
      }

      const [product, filePath] = await Promise.all([
        Product.findByPk(id),
        imgurFileHandler(file)
      ])

      if (!product) {
        req.flash('error_messages', '無法編輯不存在的產品。')
        return res.redirect('back')
      }

      await product.update({
        name,
        CategoryId: categoryId,
        price,
        weight,
        quantity,
        image: filePath || product.image,
        description
      })

      req.flash('success_messages', `該商品 ${name} 已經被修改成功。`)
      return res.redirect('/admin/products')
    } catch (err) {
      console.error(err)
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const id = req.params.id
      const product = await Product.destroy({
        where: {
          id
        }
      })

      if (!product) {
        req.flash('error_messages', '無法刪除不存在的產品。')
        return res.redirect('back')
      }
      req.flash('success_messages', '已成功刪除一項產品。')
      return res.redirect('/admin/products')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
