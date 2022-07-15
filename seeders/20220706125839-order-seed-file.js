'use strict'

const { User } = require('../models')

const faker = require('faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll({
      where: {
        role: 'user'
      }
    })

    const ORDER_ANOUNT = 10

    const PAYMENT = ['cancelled', 'unpaid', 'paid']
    const SHIPPING = ['cancelled', 'processing', 'shipped']

    await queryInterface.bulkInsert('Orders', Array.from({ length: ORDER_ANOUNT }).map((_item, index) => ({
      name: users[index % 2].name,
      User_id: users[index % 2].id,
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      payment_status: PAYMENT[Math.floor(Math.random() * PAYMENT.length)],
      shipping_status: SHIPPING[Math.floor(Math.random() * PAYMENT.length)],
      total_amount: Math.floor(Math.random() * 1000) + 500,
      created_at: new Date(),
      updated_at: new Date()
    }))
    , {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {})
  }
}
