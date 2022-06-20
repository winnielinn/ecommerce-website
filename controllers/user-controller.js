const bcrypt = require('bcryptjs')

const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')

const userController = {
  getLoginPage: (req, res) => {
    return res.render('login')
  },
  login: (req, res) => {
    req.flash('success_messages', '您已成功登入！')
    return res.redirect('/home')
  },
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        console.error(err)
      }
      req.flash('success_messages', '您已成功登出！')
      return res.redirect('/home')
    })
  },
  getRegisterPage: (req, res) => {
    return res.render('register')
  },
  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body

      if (!name || !email || !password || !confirmPassword) {
        req.flash('error_messages', '所有欄位都必須填寫。')
        return res.redirect('back')
      }

      if (password !== confirmPassword) {
        req.flash('error_messages', '密碼與確認密碼不符。')
        return res.redirect('back')
      }

      const user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('error_messages', '該使用者已經註冊過。')
        return res.redirect('back')
      }

      await User.create({
        name,
        email,
        password: await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '您已成功註冊一個帳號。')
      return res.redirect('/users/login')
    } catch (err) {
      console.error(err)
    }
  },
  getSettingPage: async (req, res, next) => {
    try {
      return res.render('users/setting')
    } catch (err) {
      console.error(err)
    }
  },
  putSetting: async (req, res, next) => {
    try {
      const id = Number(getUser(req).id)
      const { name, email } = req.body

      if (!name || !email) {
        req.flash('error_messages', '所有欄位都必須填寫。')
        return res.redirect('back')
      }

      const user = await User.findByPk(id)

      if (!user) {
        req.flash('error_messages', '該使用者不存在。')
        return res.redirect('back')
      }

      const rawUser = await User.findOne({ where: { email } })

      if (rawUser) {
        if (rawUser.get({ plain: true }).id !== id) {
          req.flash('error_messages', '此電子信箱已經被其他使用者使用過。')
          return res.redirect('back')
        }
      }

      await user.update({
        name,
        email
      })

      req.flash('success_messages', '已成功修改個人資料。')
      return res.redirect('/users/setting')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
