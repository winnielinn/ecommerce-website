'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    const category = ['當季水果', '禽豬牛羊', '蔬菜根莖', '天然加工品']

    await queryInterface.bulkInsert('Categories',
      category.map(item => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        }
      }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
