const { Product, Category, User, Order, OrderItem } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helper')

const adminService = {
  getAllProducts: async (req, callback) => {
    try {
      const products = await Product.findAll({
        include: [Category],
        nest: true,
        raw: true
      })

      return callback(null, { products })
    } catch (err) {
      callback(err)
    }
  },
  getProductPage: async (req, callback) => {
    try {
      const id = Number(req.params.id)
      let product = await Product.findByPk(id, {
        include: [Category]
      })

      if (!product) throw new Error('無法查看不存在的商品。')

      product = product.get({ plain: true })
      return callback(null, { product })
    } catch (err) {
      callback(err)
    }
  },
  getCreatePage: async (req, callback) => {
    try {
      const categories = await Category.findAll({
        nest: true,
        raw: true
      })
      return callback(null, { categories })
    } catch (err) {
      callback(err)
    }
  },
  postProduct: async (req, callback) => {
    try {
      const { name, categoryId, price, weight, quantity, description } = req.body

      if (!name || !categoryId || !price || !weight) throw new Error('* 為必填欄位。')

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

      return callback(null)
    } catch (err) {
      callback(err)
    }
  },
  getEditPage: async (req, callback) => {
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

      if (!product) throw new Error('無法查看不存在的商品。')

      product = product.get({ plain: true })
      return callback(null, { product, categories })
    } catch (err) {
      callback(err)
    }
  },
  editProduct: async (req, callback) => {
    try {
      const id = req.params.id
      const { file } = req
      const { name, categoryId, price, weight, quantity, description } = req.body

      if (!name || !categoryId || !price || !weight) throw new Error('* 為必填欄位。')

      const [product, filePath] = await Promise.all([
        Product.findByPk(id),
        imgurFileHandler(file)
      ])

      if (!product) throw new Error('無法編輯不存在的商品。')

      await product.update({
        name,
        CategoryId: categoryId,
        price,
        weight,
        quantity,
        image: filePath || product.image,
        description
      })

      return callback(null)
    } catch (err) {
      callback(err)
    }
  },
  deleteProduct: async (req, callback) => {
    try {
      const id = req.params.id
      const product = await Product.destroy({
        where: {
          id
        }
      })

      if (!product) throw new Error('無法刪除不存在的商品。')
      return callback(null)
    } catch (err) {
      callback(err)
    }
  },
  getUsersPage: async (req, callback) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        },
        order: [['order_times', 'DESC']],
        raw: true
      })
      return callback(null, { users })
    } catch (err) {
      callback(err)
    }
  },
  getOrdersPage: async (req, callback) => {
    try {
      const orders = await Order.findAll({
        raw: true
      })

      return callback(null, { orders })
    } catch (err) {
      callback(err)
    }
  },
  cancelOrder: async (req, callback) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id,
        {
          include: [
            {
              model: OrderItem,
              attributes: ['quantity', 'Product_id']
            }
          ]
        }
      )

      if (!order) throw new Error('無法取消不存在的商品。')

      // 更新訂單狀態
      await order.update({
        paymentStatus: 'cancelled',
        shippingStatus: 'cancelled'
      })

      // 把原先的數量補回 Table Product
      const orderItems = order.get({ plain: true }).OrderItems
      console.log(orderItems)
      for (let i = 0; i < orderItems.length; i++) {
        const product = await Product.findByPk(orderItems[i].Product_id)
        const quantity = orderItems[i].quantity
        await product.update({
          quantity: product.quantity += quantity
        })
      }

      return callback(null)
    } catch (err) {
      callback(err)
    }
  },
  getOrderPage: async (req, callback) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, {
        include: [
          { model: Product, as: 'orderedProducts', attributes: ['id', 'name', 'price', 'quantity', 'image'] }
        ]
      })

      if (!order) throw new Error('無法查找不存在的商品。')

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
  putOrder: async (req, callback) => {
    try {
      const id = req.params.id
      const { payment, shipment } = req.body

      const order = await Order.findByPk(id)

      if (!order) throw new Error('無法編輯不存在的訂單。')

      await order.update({
        paymentStatus: payment || order.paymentStatus,
        shippingStatus: shipment || order.shippingStatus
      })

      return callback(null, { order })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = adminService
