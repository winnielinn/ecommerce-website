const bcrypt = require('bcryptjs')

const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')

const userController = {
  getLoginPage: (req, res, next) => {
    try {
      return res.render('login')
    } catch (err) {
      next(err)
    }
  },
  login: (req, res, next) => {
    try {
      req.flash('success_messages', '您已成功登入！')
      return res.redirect('/home')
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) {
          next(err)
        }
        req.flash('success_messages', '您已成功登出！')
        return res.redirect('/home')
      })
    } catch (err) {
      next(err)
    }
  },
  getRegisterPage: (req, res, next) => {
    try {
      return res.render('register')
    } catch (err) {
      next(err)
    }
  },
  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body

      if (!name || !email || !password || !confirmPassword) throw new Error('所有欄位都必須填寫。')

      if (password !== confirmPassword) throw new Error('需入的兩次密碼不正確！')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('該使用者已經註冊過！')

      await User.create({
        name,
        email,
        password: await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '您已成功註冊一個帳號。')
      return res.redirect('/users/login')
    } catch (err) {
      next(err)
    }
  },
  getSettingPage: async (req, res, next) => {
    try {
      return res.render('users/setting')
    } catch (err) {
      next(err)
    }
  },
  putSetting: async (req, res, next) => {
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

      await user.update({
        name,
        email
      })

      req.flash('success_messages', '已成功修改個人資料。')
      return res.redirect('/users/setting')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
