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
    const postalCode = obj.content.shippingAddressPostalCode;
    let rates = [];
    let country = '';

    // Pays de livraison
    switch (obj.content.shippingAddressCountry) {
      case 'FR':
        country = 'FR';
        break;
      case 'GB':
        country = 'GB';
        break;
      default:
        country = 'EU'; // https://abbreviations.yourdictionary.com/articles/list-of-europe-country-codes.html
    }

    // Livraison FR uniquement
    /*if (country != 'FR') {
      return createResponse({
        errors: [{
          key: 'error_country',
          message: 'La livraison n\'est possible qu\'en France pour le moment.'
        }]
      });
    }*/

    // Quel(s) format(s) dans le panier
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

    // Type d'expédition conditionnée par le(s) format(s)
    if (a3 >= 1 && a5 >= 1) {
      rates.push(livraison_colissimo_lettre[country]);
    } else if (a3 >= 1 && a5 == 0) {
      rates.push(livraison_colissimo[country]);
    } else if (a5 >= 1 && a3 == 0) {
      rates.push(livraison_lettre[country]);
    }

    // Retrait à l'atelier
    if (country == 'FR') {
      rates.push(retrait_atelier);
    }

    // Livraison à vélo (Montreuil)
    if (country == 'FR' && postalCode == '93100') {
      rates.push(livraison_velo);
    }

    return createResponse({
      rates: rates
    });
  } catch (error) {
    return createResponse({
      errors: [{
        key: 'error',
        message: 'Impossible d\'afficher les modes de livraison.'
      }]
    });
  }
};
