window.addEventListener('DOMContentLoaded', function (event) {
  document.addEventListener('change', function (evt) {
    //console.log(evt.target.classList)
    if (evt.target.classList.contains('qty')) {
      var button = evt.target.parentNode.querySelector('.buy-button')
      var qty = parseInt(evt.target.value)
      button.setAttribute('data-item-quantity', qty)
      //var label = button.innerHTML
      //label = label.replace(/\d+/, evt.target.value)
      //button.innerHTML = label;
    }
    if (evt.target.classList.contains('size')) {
      var button = evt.target.parentNode.querySelector('.buy-button')
      var size = evt.target.value
      button.setAttribute('data-item-custom1-value', size)
    }
  })
});
