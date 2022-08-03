const { Product, Category, User, Order } = require('../models')

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
      let product = await Product.findByPk(id, {
        include: [Category]
      })

      if (!product) {
        req.flash('error_messages', '無法查看不存在的產品。')
        return res.redirect('back')
      }

      product = product.get({ plain: true })

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
      let [product, categories] = await Promise.all([
        Product.findByPk(id, {
          include: [Category]
        }),
        Category.findAll({
          nest: true,
          raw: true
        })
      ])

      if (!product) {
        req.flash('error_messages', '無法查看不存在的產品。')
        return res.redirect('back')
      }

      product = product.get({ plain: true })
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
  },
  getUsersPage: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        },
        order: [['order_times', 'DESC']],
        raw: true
      })
      res.render('admin/users', { users })
    } catch (err) {
      console.error(err)
    }
  },
  getOrdersPage: async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        raw: true
      })
      res.render('admin/orders', { orders })
    } catch (err) {
      console.error(err)
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)

      if (!order) {
        req.flash('error_messages', '無法取消不存在的訂單。')
        return res.redirect('back')
      }

      await order.update({
        paymentStatus: 'cancelled',
        shippingStatus: 'cancelled'
      })

      req.flash('success_messages', `已成功取消訂單編號 ${id}`)
      return res.redirect('/admin/orders')
    } catch (err) {
      console.error(err)
    }
  },
  getOrderPage: async (req, res, next) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, {
        include: [
          { model: Product, as: 'orderedProducts', attributes: ['id', 'name', 'price', 'quantity', 'image'] }
        ]
      })

      if (!order) {
        req.flash('error_messages', '無法查找不存在的訂單。')
        return res.redirect('back')
      }

      order = order.get({ plain: true })

      let totalPrice = 0

      order.orderedProducts.forEach((item, index) => (
        totalPrice += item.price * item.OrderItem.quantity
      ))

      return res.render('admin/order', { order, totalPrice })
    } catch (err) {
      console.error(err)
    }
  },
  putOrder: async (req, res, next) => {
    try {
      const id = req.params.id
      const { payment, shipment } = req.body

      if (!payment || !shipment) {
        req.flash('error_messages', '付款狀態或是運送狀態需要被選取。')
        return res.redirect('back')
      }

      const order = await Order.findByPk(id)

      if (!order) {
        req.flash('error_messages', '無法更改不存在的訂單。')
        return res.redirect('back')
      }

      await order.update({
        paymentStatus: payment,
        shippingStatus: shipment
      })

      req.flash('success_messages', '已成功更改付款狀態及運送狀態。')
      return res.redirect(`/admin/orders/${id}`)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
