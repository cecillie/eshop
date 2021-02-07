const livraison_velo = require('./data/rates/livraison_velo.json');
const livraison_colissimo = require('./data/rates/livraison_colissimo.json');
const livraison_lettre = require('./data/rates/livraison_lettre.json');
const livraison_colissimo_lettre = require('./data/rates/livraison_colissimo_lettre.json');
const retrait_atelier = require('./data/rates/retrait_atelier.json');

function createResponse(response) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  };
}

exports.handler = async ({ body }) => {
  try {
    const obj = JSON.parse(body);
    let rates = [];

    // Livraison FR uniquement
    // https://abbreviations.yourdictionary.com/articles/list-of-europe-country-codes.html
    if (obj.content.shippingAddressCountry != 'FR') {
      return createResponse({
        errors: [{
          key: 'error_country',
          message: 'La livraison n\'est possible qu\'en France pour le moment.'
        }]
      });
    }

    // Retrait dans Paris 20ème
    rates.push(retrait_atelier);
    // Livraison à Montreuil
    if (obj.content.shippingAddressPostalCode == '93100') {
      rates.push(livraison_velo);
    }
    // Quel(s) format(s)
    let a3 = 0; let a5 = 0;
    for (var i = 0; i < obj.content.items.length; i++) {
      for (var f = 0; f < obj.content.items[i].customFields.length; f++) {
        if (obj.content.items[i].customFields[f].name == 'Format') {
          if (obj.content.items[i].customFields[f].value == 'A3') {
            a3 = a3 + 1;
          }
          if (obj.content.items[i].customFields[f].value == 'A5') {
            a5 = a5 + 1;
          }
        }
      }
    }
    // Emballage(s) selon le(s) format(s)
    if (a3 >= 1 && a5 >= 1) {
      rates.push(livraison_colissimo_lettre);
    } else if (a3 >= 1 && a5 == 0) {
      rates.push(livraison_colissimo);
    } else if (a5 >= 1 && a3 == 0) {
      rates.push(livraison_lettre);
    }

    return createResponse({
      rates: rates
    });
  } catch (err) {
    return createResponse({
      errors: [{
        key: 'error',
        message: 'Impossible d\'afficher les modes de livraison.'
      }]
    });
  }
};
