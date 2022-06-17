'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'weight', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'weight')
  }
}
