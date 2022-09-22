const adminService = require('../services/admin-service')

const adminController = {
  getAllProducts: async (req, res, next) => {
    adminService.getAllProducts(req, (err, data) => err ? next(err) : res.render('admin/products', data))
  },
  getProductPage: async (req, res, next) => {
    adminService.getProductPage(req, (err, data) => err ? next(err) : res.render('admin/product', data))
  },
  getCreatePage: async (req, res, next) => {
    adminService.getCreatePage(req, (err, data) => err ? next(err) : res.render('admin/create-product', data))
  },
  postProduct: async (req, res, next) => {
    adminService.postProduct(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '已經成功新增商品。')
      return res.redirect('/admin/products')
    })
  },
  getEditPage: async (req, res, next) => {
    adminService.getEditPage(req, (err, data) => err ? next(err) : res.render('admin/edit-product', data))
  },
  editProduct: async (req, res, next) => {
    adminService.editProduct(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '商品已經被修改成功。')
      return res.redirect('/admin/products')
    })
  },
  deleteProduct: async (req, res, next) => {
    adminService.deleteProduct(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '已成功刪除一項產品。')
      return res.redirect('/admin/products')
    })
  },
  getUsersPage: async (req, res, next) => {
    adminService.getUsersPage(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  },
  getOrdersPage: async (req, res, next) => {
    adminService.getOrdersPage(req, (err, data) => err ? next(err) : res.render('admin/orders', data))
  },
  cancelOrder: async (req, res, next) => {
    adminService.cancelOrder(req, (err, data) => {
      if (err) return next(err)

      req.flash('success_messages', '已成功取消一筆訂單。')
      return res.redirect('/admin/orders')
    })
  },
  getOrderPage: async (req, res, next) => {
    adminService.getOrderPage(req, (err, data) => err ? next(err) : res.render('admin/order', data))
  },
  putOrder: async (req, res, next) => {
    adminService.putOrder(req, (err, data) => {
      if (err) return next(err)

      req.flash('success_messages', '已成功更改付款狀態或運送狀態。')
      return res.redirect(`/admin/orders/${data.order.dataValues.id}`)
    })
  }
}

module.exports = adminController
