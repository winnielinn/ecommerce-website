const button = document.querySelector('.add-cart')

function addToCart (event) {
  const list = JSON.parse(localStorage.getItem('cartItem')) || []

  list.push({ productId: event.target.dataset.id, productQuantity: 1 })
  localStorage.setItem('cartItem', JSON.stringify(list))

  const productButton = document.querySelector('.btn-group')
  const rawHtml = '<button type="submit" class="btn btn-outline-secondary" disabled>已加入購物車</button>'
  productButton.innerHTML = rawHtml
}

button.addEventListener('click', addToCart)
