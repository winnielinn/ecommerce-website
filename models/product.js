'use strict'

const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'CategoryId'
      })
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: 'ProductId',
        as: 'orderedProducts'
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER,
    weight: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  })
  return Product
}
