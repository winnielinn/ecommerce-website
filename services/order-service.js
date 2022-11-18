const { Order, Product, OrderItem, sequelize } = require('../models')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const { getTradeInfo, decryptTradeInfoAES } = require('../utils/newebpay-payment')

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
      return callback(err)
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
      return callback(err)
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
      return callback(err)
    }
  },
  getPayment: async (req, callback) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)

      if (!order) throw new Error('無法查找不存在的訂單。')

      const tradeInfo = getTradeInfo(order.dataValues.totalAmount, `${order.toJSON().id}`, req.user.email)

      return callback(null, { order: order.toJSON(), tradeInfo })
    } catch (err) {
      return callback(err)
    }
  },
  newebpayCallback: async (req, callback) => {
    const t = await sequelize.transaction()
    try {
      const decryptTradeInfo = JSON.parse(decryptTradeInfoAES(req.body.TradeInfo))
      const orderId = Number(decryptTradeInfo.Result.MerchantOrderNo.slice(10))
      if (req.body.Status === 'SUCCESS') {
        const status = 'SUCCESS'
        // 以 transaction 更新資料庫 payment 資訊
        const order = await Order.findByPk(orderId)
        await order.update({
          paymentStatus: 'paid',
          updatedAt: Date.now()
        }, { transaction: t })
        await t.commit()
        return callback(null, { orderId, status })
      } else {
        return callback(null, { orderId })
      }
    } catch (err) {
      // rollback 回資料庫
      await t.rollback()
      return callback(err)
    }
  }
}

module.exports = orderService
