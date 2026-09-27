const Stripe = require('stripe');
const livraison_velo = require('./data/rates/livraison_velo.json');
const livraison_colissimo = require('./data/rates/livraison_colissimo.json');
const livraison_lettre = require('./data/rates/livraison_lettre.json');
const livraison_colissimo_lettre = require('./data/rates/livraison_colissimo_lettre.json');
const retrait_atelier = require('./data/rates/retrait_atelier.json');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

function createResponse(statusCode, response) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  };
}

// Modes de livraison proposés selon le contenu du panier et l'adresse
function shippingRates(items, country, postalCode) {
  let rates = [];

  // Zone de livraison
  const zone = ['FR', 'GB'].includes(country) ? country : 'EU';

  // Les affiches A3 partent en Colissimo, les cartes (A5, A6) en lettre suivie
  const a3 = items.some(item => item.format == 'A3');
  const cards = items.some(item => item.format != 'A3');

  // Type d'expédition conditionnée par le(s) format(s)
  if (a3 && cards) {
    rates.push(livraison_colissimo_lettre[zone]);
  } else if (a3) {
    rates.push(livraison_colissimo[zone]);
  } else {
    rates.push(livraison_lettre[zone]);
  }

  // Retrait à l'atelier
  if (country == 'FR') {
    rates.push(retrait_atelier);
  }

  // Livraison à vélo (Montreuil)
  if (country == 'FR' && postalCode == '93100') {
    rates.push(livraison_velo);
  }

  return rates.map(rate => ({
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: rate.description,
      fixed_amount: { amount: Math.round(rate.cost * 100), currency: 'eur' },
      delivery_estimate: {
        maximum: { unit: 'business_day', value: rate.guaranteedDaysToDelivery }
      },
      metadata: { id: rate.userDefinedId }
    }
  }));
}

exports.handler = async (event) => {
  if (event.httpMethod != 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  const origin = event.rawUrl ? new URL(event.rawUrl).origin : process.env.URL;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return createResponse(400, { error: 'Invalid JSON' });
  }

  try {
    // Le catalogue généré par Cecil fait foi pour les prix
    const catalog = await (await fetch(`${origin}/catalog.json`)).json();

    const country = String(body.country || '');
    const postalCode = String(body.postalCode || '').trim();
    if (!catalog.countries.includes(country)) {
      return createResponse(400, { error: 'Pays de livraison non pris en charge.' });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length == 0 || items.length > 50) {
      return createResponse(400, { error: 'Panier invalide.' });
    }

    const lineItems = [];
    for (const item of items) {
      const product = catalog.products[item.id];
      if (!product) {
        return createResponse(400, { error: `Produit inconnu : ${item.id}` });
      }
      const hasFormats = Object.keys(product.formats).length > 0;
      const price = hasFormats ? product.formats[item.format] : product.price;
      const quantity = parseInt(item.quantity, 10);
      if (typeof price != 'number' || !(quantity >= 1 && quantity <= product.maxquantity)) {
        return createResponse(400, { error: `Article invalide : ${item.id}` });
      }
      lineItems.push({
        quantity: quantity,
        price_data: {
          currency: catalog.currency,
          unit_amount: Math.round(price * 100),
          product_data: {
            name: hasFormats ? `${product.name} (${item.format})` : product.name,
            images: [product.image],
            metadata: { id: item.id, format: hasFormats ? item.format : '' }
          }
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: [country] },
      shipping_options: shippingRates(items, country, postalCode),
      locale: 'auto',
      success_url: `${origin}/merci/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#panier`
    });

    return createResponse(200, { url: session.url });
  } catch (error) {
    console.error(error);
    return createResponse(500, { error: 'Impossible de démarrer le paiement.' });
  }
};
