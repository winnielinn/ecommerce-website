const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userController = {
  getLoginPage: (req, res) => {
    return res.render('login')
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
      return res.redirect('/user/login')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
