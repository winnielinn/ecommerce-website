const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

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

  // Facebook 認證
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async function (_accessToken, _refreshToken, profile, done) {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ where: { email } })
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      const registeredUser = await User.create({
        name,
        email,
        password: await bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
      })
      return done(null, registeredUser)
    } catch (err) {
      return done(err, false)
    }
  }))

  // Google 認證
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }, async function (_accessToken, _refreshToken, profile, done) {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ where: { email } })
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      const registeredUser = await User.create({
        name,
        email,
        password: await bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
      })
      return done(null, registeredUser)
    } catch (err) {
      return done(err, false)
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
}
