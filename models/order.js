'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }
  }
  Order.init({
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    paymentStatus: DataTypes.STRING,
    shippingStatus: DataTypes.STRING,
    totalAmount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
