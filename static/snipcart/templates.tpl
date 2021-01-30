<!DOCTYPE html>
<html>
  <head>
    <title>Snip templates</title>
  </head>
  <body>
    <div id="snipcart-templates">
      <!-- cart line with custom field -->
      <cart-summary-item>
        <div class="root">
          <slot v-bind="item">
            <li class="snipcart-cart-summary-item">
              <span class="snipcart-cart-summary-item__name snipcart__font--slim">
                {{ item.name }} ({{ item.customFields[0].value }})
              </span>
              <span class="snipcart-cart-summary-item__quantity snipcart__font--slim">
                {{ $localize('cart_summary.quantity') }}{{ item.quantity }}
              </span>
              <span class="snipcart-cart-summary-item__price snipcart__font--slim">
                {{ item.totalPrice | money(currency) }}
              </span>
            </li>
          </slot>
        </div>
      </cart-summary-item>
      <!-- address fields without suggestion -->
      <address-fields>
        <div class="root">
          <overridable name="address-fields" section="top"></overridable>
          <fieldset class="snipcart-form__set">
            <div class="snipcart-form__field">
              <div class="snipcart-form__field snipcart-form__cell--large">
                <snipcart-label class="snipcart__font--tiny" for="address1">{{ $localize('address_form.address1') }}
                </snipcart-label>
                <snipcart-input name="address1"></snipcart-input>
                <snipcart-error-message name="address1"></snipcart-error-message>
              </div>
            </div>
            <div class="snipcart-form__row">
              <div class="snipcart-form__field snipcart-form__cell--tidy">
                <snipcart-label class="snipcart__font--tiny" for="postalCode">{{ $localize('address_form.postalCode') }}</snipcart-label>
                <snipcart-input name="postalCode"></snipcart-input>
                <snipcart-error-message name="postalCode"></snipcart-error-message>
              </div>
              <div class="snipcart-form__field snipcart-form__cell--large">
                <snipcart-label class="snipcart__font--tiny" for="city">{{ $localize('address_form.city') }}</snipcart-label>
                <snipcart-input name="city"></snipcart-input>
                <snipcart-error-message name="city"></snipcart-error-message>
              </div>
            </div>
            <div class="snipcart-form__field">
              <snipcart-label class="snipcart__font--tiny" for="country">{{ $localize('address_form.country') }}</snipcart-label>
              <snipcart-typeahead type="dropdown" name="country" autocomplete="country"></snipcart-typeahead>
              <snipcart-error-message name="country"></snipcart-error-message>
            </div>
          </fieldset>
        </div>
      </address-fields>
    </div>
  </body>
</html>
