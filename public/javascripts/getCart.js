(async function getCart () {
  'use strict'

  // 將存放在 local storage 內的 id 拿出來
  const productIds = JSON.parse(localStorage.getItem('cartItem'))

  // 設定總金額
  let totalPrice = 0

  // 以 axios 方式呼叫 api 並取得相對應 product_id 的 product
  const response = await axios.get('/api/cartItems', {
    params: {
      productIds: productIds.reduce((f, s) => `${f},${s}`)
    }
  })

  const products = response.data

  // 預設在購物車的數量為 1
  // 進行總金額加總
  for (let i = 0; i < products.length; i++) {
    products[i].quantityInCart = 1
    totalPrice += products[i].quantityInCart * products[i].price
  }

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
      <td>
        <span class="price">${products[i].price}</span>
      </td>
      <td>
        <a class="btn btn-sm btn-outline-secondary add-product-quantity" data-id="${products[i].id}">+</a>
        <span class="prodcut-quantity p-2">${products[i].quantityInCart}</span>
        <a class="btn btn-sm btn-outline-secondary reduce-product-quantity" data-id="${products[i].id}">-</a>
      </td>
      <td>
        <span class="prodcut-price-multiply-quantity">${products[i].price} * ${products[i].quantityInCart}</span>
      </td>
      <td>
        <i class="fa-solid fa-trash-can remove-product"></i>
      </td>
      <input type="hidden" name="productId" class="productId" value="${products[i].id}" />
      <input type="hidden" class="productQuantityInCart${products[i].id}" name="productQuantityInCart" value="${products[i].quantityInCart}" />
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
        <h6 style="margin: 0;" class="total-price">$ ${totalPrice}</h6>
      </td>
            <td></td>
    </tr>
  `

  cart.innerHTML = rawHTML
})()
