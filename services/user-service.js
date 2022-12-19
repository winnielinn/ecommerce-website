const bcrypt = require('bcryptjs')

const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')

const userService = {
  getLoginPage: async (req, callback) => {
    try {
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  },
  login: async (req, callback) => {
    try {
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  },
  getRegisterPage: async (req, callback) => {
    try {
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  },
  register: async (req, callback) => {
    try {
      const { name, email, password, confirmPassword } = req.body

      if (!name || !email || !password || !confirmPassword) throw new Error('所有欄位都必須填寫。')

      if (password !== confirmPassword) throw new Error('需入的兩次密碼不正確！')

      const rawUser = await User.findOne({ where: { email } })
      if (rawUser) throw new Error('該使用者已經註冊過！')

      const registeredUser = await User.create({
        name,
        email,
        password: await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      return callback(null, { registeredUser })
    } catch (err) {
      return callback(err)
    }
  },
  getSettingPage: async (req, callback) => {
    try {
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  },
  putSetting: async (req, callback) => {
    try {
      const id = Number(getUser(req).id)
      const { name, email } = req.body

      if (!name || !email) throw new Error('所有欄位都必須填寫！')

      const user = await User.findByPk(id)

      if (!user) throw new Error('該使用者不存在。')

      const rawUser = await User.findOne({ where: { email } })

      if (rawUser) {
        if (rawUser.get({ plain: true }).id !== id) throw new Error('此電子信箱已經被其他使用者使用過。')
      }

      const updatedUser = await user.update({
        name,
        email,
        updatedAt: Date.now()
      })

      return callback(null, { updatedUser })
    } catch (err) {
      return callback(err)
    }
  },
  getEmailPage: async (req, callback) => {
    try {
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = userService
