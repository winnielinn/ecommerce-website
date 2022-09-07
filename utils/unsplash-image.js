if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const axios = require('axios')

const UNSPLASH_CLIENT_ID = process.env.UNSPLASH_CLIENT_ID
const URL = `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_CLIENT_ID}`

const SEARCH_ITEM = 'agricultural food'
const QUANTITY = 30 // 和 PRODUCT_AMOUNT in product-seed-file 相同

const SEARCH_URL = URL + `&per_page=${QUANTITY}&query=${SEARCH_ITEM}&orientation=squarish`

async function createImage (req, res, next) {
  try {
    const response = await axios.get(SEARCH_URL)
    const data = response.data.results
    const image = await data.map((item, _index) => item.urls.small)

    return image
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createImage
}
