const userController = {
  getLoginPage: (req, res, next) => {
    return res.render('login')
  },
  getRegisterPage: (req, res, next) => {
    return res.render('register')
  }
}

module.exports = userController
