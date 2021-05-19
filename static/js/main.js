window.addEventListener('DOMContentLoaded', function (event) {
  document.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('qty')) {
      var button = evt.target.parentNode.parentNode.querySelector('.buy-button')
      var qty = parseInt(evt.target.value)
      button.setAttribute('data-item-quantity', qty)
    }
    if (evt.target.classList.contains('format')) {
      var button = evt.target.parentNode.parentNode.querySelector('.buy-button')
      var format = evt.target.value
      button.setAttribute('data-item-custom1-value', format)
      // PDF
      var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      button.removeAttribute('data-item-file-guid')
      if (format == 'PDF' && pattern.test(button.getAttribute('data-guid'))) {
        button.setAttribute('data-item-file-guid', button.getAttribute('data-guid'))
      }
    }
  })
});
