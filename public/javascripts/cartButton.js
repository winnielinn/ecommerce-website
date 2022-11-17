(async function getCart () {
  'use strict'

  const list = JSON.parse(localStorage.getItem('cartItem')) || []
  const productId = document.querySelector('.product-id').innerText
  if (list.some(item => item.productId === productId)) {
    const productButton = document.querySelector('.btn-group')
    const rawHtml = '<button type="submit" class="btn btn-outline-secondary" disabled>已加入購物車</button>'
    productButton.innerHTML = rawHtml
  }
})()
