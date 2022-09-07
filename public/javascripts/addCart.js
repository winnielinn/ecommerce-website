const button = document.querySelector('.add-cart')

function addToCart (event) {
  const list = JSON.parse(localStorage.getItem('cartItem')) || []

  if (list.some(item => item === event.target.dataset.id)) {
    return alert('該商品已在購物車中。')
  }

  list.push(event.target.dataset.id)
  localStorage.setItem('cartItem', JSON.stringify(list))
}

button.addEventListener('click', addToCart)
