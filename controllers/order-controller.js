const { Order, Product, OrderItem } = require('../models')

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
  },
  postOrder: async (req, res, next) => {
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

      res.render('users/finish-order', { order: newOrder })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = orderController
