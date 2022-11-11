const { Order, Product, OrderItem } = require('../models')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const orderService = {
  getOrders: async (req, callback) => {
    try {
      let orders = await Order.findAll({
        where: { UserId: req.user.id },
        raw: true,
        order: [['created_at', 'DESC']]
      })

      orders = orders.map(order => ({
        ...order,
        date: dayjs.utc(order.createdAt).format('YYYY/MM/DD HH:mm:ss')
      }))

      return callback(null, { orders })
    } catch (err) {
      callback(err)
    }
  },
  getOrder: async (req, callback) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, {
        include: [
          { model: Product, as: 'orderedProducts', attributes: ['id', 'name', 'price', 'quantity', 'image', 'weight'] }
        ]
      })

      if (!order) throw new Error('無法查找不存在的訂單。')

      order = order.get({ plain: true })

      let totalPrice = 0

      order.orderedProducts.forEach((item, index) => (
        totalPrice += item.price * item.OrderItem.quantity
      ))

      return callback(null, { order, totalPrice })
    } catch (err) {
      callback(err)
    }
  },
  postOrder: async (req, callback) => {
    try {
      let { name, phone, address, totalAmount, productId, price, quantityInCart } = req.body
      const UserId = req.user.id

      const productIdArray = []
      const quantityArray = []
      productIdArray.push(productId)
      quantityArray.push(quantityInCart)

      productId = (typeof productId === 'string') ? productIdArray : productId
      quantityInCart = (typeof quantityInCart === 'string') ? quantityArray : quantityInCart

      // 先寫進 Table Order
      const order = await Order.create({
        name,
        UserId,
        phone,
        address,
        totalAmount
      })

      const newOrder = order.get({ plain: true })

      // 將該筆訂單的內容寫進 Table OrderItem
      for (let i = 0; i < productId.length; i++) {
        await OrderItem.create({
          OrderId: newOrder.id,
          ProductId: productId[i],
          quantity: quantityInCart[i],
          price: price[i]
        })

        const product = await Product.findByPk(productId[i])
        await product.update({
          quantity: product.quantity -= quantityInCart[i]
        })
      }
      return callback(null, { order: newOrder })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = orderService
