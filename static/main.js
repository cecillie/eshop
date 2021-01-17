window.addEventListener('DOMContentLoaded', function (event) {
  document.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('qty')) {
      var button = evt.target.parentNode.querySelector('.buy-button')
      var qty = parseInt(evt.target.value)
      button.setAttribute('data-item-quantity', qty)
    }
    if (evt.target.classList.contains('size')) {
      var button = evt.target.parentNode.querySelector('.buy-button')
      var size = evt.target.value
      button.setAttribute('data-item-custom1-value', size)
    }
  })
});
