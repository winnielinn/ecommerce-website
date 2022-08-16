(async function getCart () {
  'use strict'

  // 將存放在 local storage 內的 id 拿出來
  let products = []
  const productIds = JSON.parse(localStorage.getItem('cartItem'))

  console.log(productIds)

  // 以 axios 方式呼叫 api 並取得相對應 product_id 的 product
  await axios.get('/api/cartItems', {
    params: {
      productIds: productIds.reduce((f, s) => `${f},${s}`)
    }
  })
    .then(response => {
      products = response.data
    })

  // 將獲取的 product 資料動態渲染頁面
  const cart = document.querySelector('.cart')

  let rawHTML = ''

  for (let i = 0; i < products.length; i++) {
    rawHTML += `
    <tr>
      <td><img src="${products[i].image}" alt="產品照片"
        width="150px"
        height="100px"
        style="transition: opacity 0.5s; opacity:0;"
        onload="this.style.opacity=1;"></td>
      <td>${products[i].name}</td>
      <td>${products[i].price}</td>
      <td>1</td>
      <td>${products[i].price} * ${products[i].quantity}</td>
    </tr>
    `
  }

  // 將獲取的總金額塞回頁面
  rawHTML += `
    <tr>
      <td></td>
      <td></td>
      <td style="text-align: right;">
      </td>
      <td>
        <h6 style="margin: 0;">總金額: </h6>
      </td>
      <td>
        <h6 style="margin: 0;">$ </h6>
      </td>
    </tr>
  `

  cart.innerHTML = rawHTML
})()
