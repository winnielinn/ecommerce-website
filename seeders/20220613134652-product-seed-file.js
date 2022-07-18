'use strict'

const { faker } = require('@faker-js/faker')

const { createImage } = require('../utils/unsplash-image')

module.exports = {
  async up (queryInterface, Sequelize) {
    // 查詢 Categories 的 id 有哪些
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const PRODUCT_AMOUNT = 30
    const length = categories.length
    const image = await createImage()

    await queryInterface.bulkInsert('Products',
      Array.from({ length: PRODUCT_AMOUNT }).map((_item, index) => ({
        name: faker.word.noun(),
        Category_id: categories[Math.floor(Math.random() * length)].id,
        price: 500 + 50 * (Math.floor(Math.random() * 10)),
        quantity: Math.floor(Math.random() * 100),
        description: faker.lorem.sentence(),
        image: image[index],
        weight: '600 克/盒',
        created_at: new Date(),
        updated_at: new Date()
      }))
      , {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
