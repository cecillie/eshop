window.addEventListener('DOMContentLoaded', function (event) {
  document.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('qty')) {
      const qty = parseInt(evt.target.value)
      const button = evt.target.parentNode.parentNode.querySelector('.buy-button')
      button.setAttribute('data-item-quantity', qty)
    }
    if (evt.target.classList.contains('format')) {
      const format = evt.target.value
      const button = evt.target.parentNode.parentNode.querySelector('.buy-button')
      button.setAttribute('data-item-custom1-value', format)
      // numeric formats
      const numeric = ['PDF', 'JPG']
      const guidPattern = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i'
      button.removeAttribute('data-item-file-guid')
      if (numeric.includes(format) && guidPattern.test(button.getAttribute('data-item-file-guid-' + format.toLowerCase()))) {
        button.setAttribute('data-item-file-guid', button.getAttribute('data-item-file-guid-' + format.toLowerCase()))
      }
    }
  })
});
