window.addEventListener('DOMContentLoaded', function () {
  const cart = document.getElementById('cart')
  if (!cart) return

  const STORAGE_KEY = 'cart'
  const locale = cart.dataset.locale
  const list = cart.querySelector('.cart__items')
  const itemTemplate = document.getElementById('cart-item')
  const form = cart.querySelector('.cart__footer')
  const country = cart.querySelector('.cart__country')
  const postcode = cart.querySelector('.cart__postcode')
  const postcodeInput = cart.querySelector('.cart__postcode-input')
  const error = cart.querySelector('.cart__error')
  const checkout = cart.querySelector('.cart__checkout')
  let catalog = null
  let money = null

  // storage: [{ id, format, quantity }]
  function load () {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch (e) {
      return []
    }
  }
  function save (items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {}
    render()
  }

  function productOf (item) {
    return catalog && catalog.products[item.id]
  }
  function priceOf (item) {
    const product = productOf(item)
    if (!product) return null
    return item.format ? product.formats[item.format] : product.price
  }

  function render () {
    const items = load()
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count })
    cart.classList.toggle('cart--empty', items.length === 0)
    if (!catalog) return
    list.replaceChildren()
    let subtotal = 0
    items.forEach(function (item, index) {
      const product = productOf(item)
      const price = priceOf(item)
      if (!product || price === undefined) return
      subtotal += price * item.quantity
      const li = itemTemplate.content.firstElementChild.cloneNode(true)
      li.querySelector('.cart__item-image').src = product.image
      li.querySelector('.cart__item-image').alt = product.name
      li.querySelector('.cart__item-name').href = product.url
      li.querySelector('.cart__item-name').textContent = product.name
      li.querySelector('.cart__item-format').textContent = item.format || ''
      li.querySelector('.cart__item-price').textContent = money.format(price)
      const qty = li.querySelector('.cart__item-qty')
      qty.value = item.quantity
      qty.max = product.maxquantity
      qty.addEventListener('change', function () {
        const all = load()
        all[index].quantity = clamp(parseInt(qty.value), product.maxquantity)
        save(all)
      })
      li.querySelector('.cart__item-remove').addEventListener('click', function () {
        const all = load()
        all.splice(index, 1)
        save(all)
      })
      list.appendChild(li)
    })
    cart.querySelector('.cart__subtotal-amount').textContent = money.format(subtotal)
  }

  function clamp (quantity, max) {
    return Math.min(Math.max(quantity || 1, 1), max || 10)
  }

  function add (id, format, quantity) {
    const items = load()
    const existing = items.find(item => item.id === id && item.format === format)
    const max = catalog && catalog.products[id] ? catalog.products[id].maxquantity : 10
    if (existing) {
      existing.quantity = clamp(existing.quantity + quantity, max)
    } else {
      items.push({ id: id, format: format, quantity: clamp(quantity, max) })
    }
    save(items)
  }

  function open () {
    cart.hidden = false
    document.body.classList.add('cart-open')
    cart.querySelector('.cart__close').focus()
  }
  function close () {
    cart.hidden = true
    document.body.classList.remove('cart-open')
  }

  function updatePostcode () {
    postcode.hidden = country.value !== 'FR'
  }

  // catalog
  fetch(cart.dataset.catalogUrl)
    .then(response => response.json())
    .then(function (data) {
      catalog = data
      money = new Intl.NumberFormat(locale, { style: 'currency', currency: catalog.currency })
      const names = new Intl.DisplayNames([locale], { type: 'region' })
      catalog.countries
        .map(code => ({ code: code, name: names.of(code) }))
        .sort((a, b) => a.code === 'FR' ? -1 : b.code === 'FR' ? 1 : a.name.localeCompare(b.name, locale))
        .forEach(c => country.add(new Option(c.name, c.code)))
      updatePostcode()
      // drop items that are no longer sold
      const items = load()
      const valid = items.filter(item => priceOf(item) != null)
      valid.length === items.length ? render() : save(valid)
    })

  // events
  document.addEventListener('click', function (evt) {
    const button = evt.target.closest('.buy-button[data-product-id]')
    if (button) {
      const details = button.closest('.product__details')
      const format = details.querySelector('select.format')
      const qty = details.querySelector('.qty')
      add(button.dataset.productId, format ? format.value : null, qty ? parseInt(qty.value) : 1)
      open()
      return
    }
    if (evt.target.closest('[data-cart-open]')) open()
    if (evt.target.closest('[data-cart-close]')) close()
  })
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' && !cart.hidden) close()
  })
  country.addEventListener('change', updatePostcode)

  form.addEventListener('submit', function (evt) {
    evt.preventDefault()
    const items = load()
    if (!items.length) return
    error.hidden = true
    checkout.disabled = true
    fetch(cart.dataset.checkoutUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items,
        country: country.value,
        postalCode: country.value === 'FR' ? postcodeInput.value.trim() : ''
      })
    })
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(function (data) {
        window.location.href = data.url
      })
      .catch(function () {
        error.hidden = false
        checkout.disabled = false
      })
  })

  // back from Stripe Checkout
  const params = new URLSearchParams(window.location.search)
  if (params.has('session_id')) save([])
  if (window.location.hash === '#panier') open()

  window.addEventListener('storage', function (evt) {
    if (evt.key === STORAGE_KEY) render()
  })
  // restore state when the page is served from the bfcache (back button from Stripe)
  window.addEventListener('pageshow', function (evt) {
    if (evt.persisted) {
      checkout.disabled = false
      render()
    }
  })

  render()
})
