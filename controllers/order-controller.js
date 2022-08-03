const { Order, Product } = require('../models')

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
  },
  getOrder: async (req, res, next) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, {
        include: [
          { model: Product, as: 'orderedProducts', attributes: ['id', 'name', 'price', 'quantity', 'image', 'weight'] }
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

      return res.render('users/order', { order, totalPrice })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = orderController
