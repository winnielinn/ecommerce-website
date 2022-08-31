const button = document.querySelector('.submit-order-button')

function removeLocalStorage () {
  localStorage.removeItem('cartItem')
}

button.addEventListener('click', removeLocalStorage)
