const { Order } = require('../models')

const orderController = {
  getOrdersPage: async (req, res, next) => {
    const orders = await Order.findAll({
      raw: true
    })
    res.render('admin/orders', { orders })
  }
}

module.exports = orderController
