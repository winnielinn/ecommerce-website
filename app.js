const path = require('path')
const express = require('express')
const handlebarsHelper = require('./helpers/handlerbars-helper')
const exphbs = require('express-handlebars').create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: handlebarsHelper
})
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const passport = require('./config/passport')
const routes = require('./routes')

const { getUser } = require('./helpers/auth-helper')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000

// handlebars 樣板設定
app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs')
app.use(methodOverride('_method'))
app.use(express.static('public'))

// body parser
app.use(express.urlencoded({ extended: true }))

// session 儲存使用者認證狀態
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}))

passport(app)

// flash 提示訊息
app.use(flash())

app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`App is listening on port ${port}`)
})
