<!DOCTYPE html>
<html>
  <head>
    <title>Snipcart templates</title>
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
              <snipcart-label class="snipcart__font--tiny" for="address1">{{ $localize('address_form.address1') }}</snipcart-label>
              <snipcart-input name="address1"></snipcart-input>
              <snipcart-error-message name="address1"></snipcart-error-message>
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
              <snipcart-typeahead type="dropdown" name="country"></snipcart-typeahead>
              <snipcart-error-message name="country"></snipcart-error-message>
            </div>
            <!--
            <div class="snipcart-form__field">
              <snipcart-label class="snipcart__font--tiny" for="province">{{ $localize('address_form.province') }}</snipcart-label>
              <snipcart-typeahead type="dropdown" name="province"></snipcart-typeahead>
              <snipcart-error-message name="province"></snipcart-error-message>
            </div>
            -->
          </fieldset>
        </div>
      </address-fields>
      <!-- Order custom fields -->
      <billing section="bottom">
        <!-- Gift message -->
        <fieldset class="snipcart-form__set">
          <div class="snipcart-form__field">
            <snipcart-label class="snipcart__font--tiny" for="giftMessage">Message cadeau (optionnel)</snipcart-label>
            <snipcart-input name="giftMessage"></snipcart-input>
            <p class="snipcart__font--tiny">(Votre message sera écrit à la main sur une carte ajoutée dans le colis)</p>
          </div>
          <!-- Newsletter -->
          <!--
          <div class="snipcart-form__field">
            <div class="snipcart-form__field-checkbox">
              <snipcart-checkbox name="subscribeToNewsletter"></snipcart-checkbox>
              <snipcart-label for="subscribeToNewsletter" class="snipcart__font--tiny snipcart-form__label--checkbox">S'abonner à la newsletter</snipcart-label>
            </div>
          </div>
          -->
        </fieldset>
      </billing>
      <!-- shipping rate item -->
      <!--
      <shipping-rates-list-item>
        <div class="root">
          <li class="snipcart-shipping-rates-list-item snipcart__font--secondary snipcart__font--bold">
            <span>
              <snipcart-radio name="selectedRate" class="snipcart-shipping-rates-list-item__label--highlight" :value="slug" :id="`selectedRate-${slug}`">
                {{ description }}
              </snipcart-radio>
            </span>
            <span v-if="cost > 0" class="snipcart-shipping-rates-list-item--right snipcart-shipping-rates-list-item__price snipcart__font--black">
              {{ cost | money(currency) }}
            </span>
            <span v-else class="snipcart-shipping-rates-list-item--right snipcart-shipping-rates-list-item__price snipcart__font--black">
              Gratuit
            </span>
          </li>
        </div>
      </shipping-rates-list-item>
      -->
    </div>
  </body>
</html>
