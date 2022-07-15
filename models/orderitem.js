'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'OrderId'
      })
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'ProductId'
      })
    }
  }
  OrderItem.init({
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItems',
    underscored: true
  })
  return OrderItem
}
