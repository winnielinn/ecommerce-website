const { Order } = require('../models')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const orderController = {
  getOrders: async (req, res, next) => {
    try {
      let orders = await Order.findAll({
        where: { UserId: req.user.id },
        raw: true
      })

      orders = orders.map(order => ({
        ...order,
        date: dayjs.utc(order.createdAt).format('YYYY/MM/DD HH:mm:ss')
      }))

      res.render('users/orders', { orders })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = orderController
