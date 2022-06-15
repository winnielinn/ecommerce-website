const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

// 本地認證
passport.use(new LocalStrategy({
  usernameField: 'email',
  paasswordField: 'password',
  passReqToCallback: true
},
async function (req, email, password, done) {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤。'))

    return done(null, user)
  } catch (err) {
    done(err)
  }
}
))

// 序列化和反序列化
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id)
    done(null, user.toJSON())
  } catch (err) {
    done(err)
  }
})

module.exports = passport
