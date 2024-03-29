const bcrypt = require('bcryptjs')

const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const nodeMailer = require('../utils/nodemailer')

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
  },
  forgetPassword: async (req, callback) => {
    try {
      const { email } = req.body
      if (!email) throw new Error('不可輸入空的電子信箱。')

      const rawUser = await User.findOne({ where: { email } })
      if (!rawUser) throw new Error(`此電子信箱 ${email} 並未註冊過，請重新輸入。`)

      const user = rawUser.get({ plain: true })
      const verifyCode = Math.random().toString(36).slice(-8)

      await nodeMailer(user, email, verifyCode)

      return callback(null, { email, verifyCode })
    } catch (err) {
      return callback(err)
    }
  },
  resetPassword: async (req, callback) => {
    try {
      const { email, verifyCode, isVerifyCode, newPassword, confirmPassword } = req.body
      console.log(email, verifyCode, isVerifyCode, newPassword, confirmPassword)
      if (!email || !isVerifyCode || !verifyCode || !newPassword || !confirmPassword) throw new Error('所有欄位都必須填寫，請重新獲取驗證碼。')

      if (verifyCode !== isVerifyCode) throw new Error('驗證碼輸入錯誤，請重新獲取驗證碼。')

      if (newPassword !== confirmPassword) throw new Error('輸入的兩次密碼不相符，請重新獲取驗證碼。')

      const user = await User.findOne({ where: { email } })
      if (!user) throw new Error('使用者不存在，請輸入正確的電子信箱並重新獲取驗證碼。')

      const hash = await bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
      await user.update({
        password: hash
      })
      return callback(null)
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = userService
