(async function getCart () {
  'use strict'

  // 全域變數
  const products = JSON.parse(localStorage.getItem('cartItem'))
  let rawHTML = ''

  if (products === null || products.length <= 0) {
    rawHTML = `<img class="rounded mx-auto d-block mb-5" style="width: 20%;" src="https://store.sony.com.tw/resource/images/icon/cart_null.png">
    <p class="text-center fs-3">你的購物車目前沒有任何商品喔！</p>
    <div class="d-grid gap-2 col-2 mx-auto">
      <a href="/products" class="btn btn-outline-secondary btn-block mt-2" style="background-color: #FF7575; border-color:#FF7575; color:white;">來去逛逛</a>
    </div>
    `
    const cartPage = document.querySelector('.cartpage')
    cartPage.innerHTML = rawHTML
  } else {
    // 設定變數
    let totalPrice = 0
    const cart = document.querySelector('.cart')

    for (const item of products) {
      // 以 axios 方式呼叫 api 並取得相對應 product_id 的 product
      const response = await axios.get('/api/cartItems', {
        params: {
          productIds: item.productId.toString()
        }
      })
      const product = response.data

      // 進行總金額加總
      totalPrice += Number(product[0].price) * Number(item.productQuantity)

      // 單筆產品運算
      const price = Number(product[0].price) * Number(item.productQuantity)

      // 將獲取的 product 資料動態渲染頁面
      rawHTML += `
        <tr>
          <td><img src="${product[0].image}" alt="產品照片"
            width="150px"
            height="100px"
            style="transition: opacity 0.5s; opacity:0;"
            onload="this.style.opacity=1;"></td>
          <td>${product[0].name}</td>
          <td>
            <span>$ </span><span class="price">${product[0].price}</span>
          </td>
          <td>
            <a class="btn btn-sm btn-outline-secondary add-product-quantity" data-id="${product[0].id}">+</a>
            <span class="prodcut-quantity p-2">${Number(item.productQuantity)}</span>
            <a class="btn btn-sm btn-outline-secondary reduce-product-quantity" data-id="${product[0].id}">-</a>
          </td>
          <td>
            <span class="prodcut-price-multiply-quantity">$ ${price}</span>
          </td>
          <td>
            <i class="fa-solid fa-trash-can remove-product"></i>
          </td>
          <input type="hidden" name="productId" class="productId" value="${product[0].id}" />
          <input type="hidden" class="productQuantityInCart${product[0].id}" name="productQuantityInCart" value="${Number(item.productQuantity)}" />
        </tr>
      `
    }

    // 將計算的總金額塞回頁面
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
  }
})()
