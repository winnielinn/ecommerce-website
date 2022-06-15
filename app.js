const express = require('express')
const exphbs = require('express-handlebars').create({ defaultLayout: 'main', extname: '.hbs' })
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const routes = require('./routes')

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

// flash 提示訊息
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`App is listening on port ${port}`)
})
