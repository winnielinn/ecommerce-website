const orderService = require('../services/order-service')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const orderController = {
  getOrders: async (req, res, next) => {
    orderService.getOrders(req, (err, data) => err ? next(err) : res.render('users/orders', data))
  },
  getOrder: async (req, res, next) => {
    orderService.getOrder(req, (err, data) => err ? next(err) : res.render('users/order', data))
  },
  postOrder: async (req, res, next) => {
    orderService.postOrder(req, (err, data) => err ? next(err) : res.render('users/finish-order', data))
  },
  getCheckoutPage: async (req, res, next) => {
    orderService.getCheckoutPage(req, (err, data) => err ? next(err) : res.render('users/finish-order', data))
  }
}

module.exports = orderController
