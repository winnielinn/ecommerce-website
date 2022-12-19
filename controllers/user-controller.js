const userService = require('../services/user-service')

const userController = {
  getLoginPage: async (req, res, next) => {
    userService.getLoginPage(req, (err, _data) => err ? next(err) : res.render('login'))
  },
  login: async (req, res, next) => {
    userService.login(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '您已成功登入！')
      return res.redirect('/home')
    })
  },
  logout: async (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) return next(err)
        req.flash('success_messages', '您已成功登出！')
        return res.redirect('/home')
      })
    } catch (err) {
      return next(err)
    }
  },
  getRegisterPage: async (req, res, next) => {
    userService.getRegisterPage(req, (err, _data) => err ? next(err) : res.render('register'))
  },
  register: async (req, res, next) => {
    userService.register(req, (err, data) => {
      if (err) {
        return next(err)
      } else {
        req.login(data.registeredUser, () => {
          req.flash('success_messages', '您已成功註冊一個帳號。')
          res.redirect('/home')
        })
      }
    })
  },
  getSettingPage: async (req, res, next) => {
    userService.getSettingPage(req, (err, _data) => err ? next(err) : res.render('users/setting'))
  },
  putSetting: async (req, res, next) => {
    userService.putSetting(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '已成功修改個人資料。')
      return res.redirect('/users/setting')
    })
  },
  getEmailPage: async (req, res, next) => {
    userService.getEmailPage(req, (err, _data) => err ? next(err) : res.render('users/email-check'))
  }
}

module.exports = userController
