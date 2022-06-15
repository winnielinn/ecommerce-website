const { getUser, ensureAuthenticated } = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) return next()

  req.flash('error_messages', '請先登入！')
  return res.redirect('/user/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') return next()
    return res.redirect('/')
  }

  return res.redirect('/user/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
