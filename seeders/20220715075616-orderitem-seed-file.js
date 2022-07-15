'use strict'

const { Order, Product } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    const order = await Order.findAll()
    const product = await Product.findAll()

    const PRODUCT_PER_ORDER = 20

    await queryInterface.bulkInsert('OrderItems', Array.from({ length: PRODUCT_PER_ORDER }).map((item, index) => ({
      Order_id: order[index % 10].id,
      Product_id: product[index % 30].id,
      quantity: Math.floor(Math.random() * 10 + 1),
      price: product[index % 30].price,
      created_at: new Date(),
      updated_at: new Date()
    }))
    , {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderItems', null, {})
  }
}
