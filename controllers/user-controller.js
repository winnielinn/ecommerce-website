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
      if (!name || !email || !password || !confirmPassword) throw new Error('所有欄位都是必填。')
      if (password !== confirmPassword) throw new Error('輸入的兩次密碼不相符。')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('該使用者已經註冊過。')

      await User.create({
        name,
        email,
        password: await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      return res.redirect('/user/login')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
