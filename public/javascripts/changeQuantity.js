const cart = document.querySelector('.cart')

async function dataPanelControl (event) {
  // 先找到觸發案件的目標並得到目前於購物車的數量和 id
  const target = event.target
  const quantityInCart = target.parentElement.children[1]
  const productId = target.dataset.id

  if (target.matches('.add-product-quantity') || target.matches('.reduce-product-quantity')) {
    let quantityChanged = Number(quantityInCart.textContent)

    // 透過 API 拿到該 id 的 product
    const response = await axios.get('/api/cartItem', {
      params: {
        productId
      }
    })
    const product = response.data

    // 判斷點擊的目標為加減或刪除
    if (target.matches('.add-product-quantity')) {
      const quantity = quantityChanged < product.quantity ? ++quantityChanged : quantityChanged = product.quantity

      target.parentElement.nextElementSibling.children[0].innerText = `${product.price} * ${quantity}`
    } else {
      const quantity = quantityChanged <= 1 ? 1 : --quantityChanged

      target.parentElement.nextElementSibling.children[0].innerText = `${product.price} * ${quantity}`
    }

    // 將產品數量改變
    quantityInCart.innerText = quantityChanged

    // 修改傳回後端的值
    document.querySelector(`.productQuantityInCart${productId}`).value = quantityChanged
  } else if (target.matches('.remove-product')) {
    // localStorageq 刪除
    const productIds = JSON.parse(localStorage.getItem('cartItem'))
    const prodcutIndex = productIds.findIndex(id => Number(id) === Number(productId))
    productIds.splice(prodcutIndex, 1)

    localStorage.setItem('cartItem', JSON.stringify(productIds))

    // 畫面刪除
    target.parentElement.parentElement.remove()
  }

  // 更改總金額
  const productQuantity = document.querySelectorAll('.prodcut-quantity')
  const productPrice = document.querySelectorAll('.price')
  const totalPrice = document.querySelector('.total-price')
  let totalPriceInCart = 0

  for (let i = 0; i < productQuantity.length; i++) {
    totalPriceInCart += Number(productQuantity[i].innerText) * Number(productPrice[i].innerText)
  }

  totalPrice.innerText = `$ ${totalPriceInCart}`
}

cart.addEventListener('click', dataPanelControl)
