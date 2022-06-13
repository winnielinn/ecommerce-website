const express = require('express')
const exphbs = require('express-handlebars').create({ defaultLayout: 'main', extname: '.hbs' })
const methodOverride = require('method-override')

const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs')
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(routes)

app.listen(port, () => {
  console.info(`App is listening on port ${port}`)
})
