exports.handler = async ({ body }) => {
  try {
    const obj = JSON.parse(body);

    // Livraison FR uniquement
    if (obj.content.shippingAddressCountry != 'FR') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errors: [{
            key: 'error_country',
            message: 'La livraison n\'est possible qu\'en France pour le moment.'
          }]
        })
      };
    }

    // Retrait dans le 20ème
    let rates = [{
      cost: 0,
      description: 'Retrait (Paris 20ème)',
      userDefinedId: 'retrait'
    }];
    // Livraison à vélo
    const rate_montreuil = {
      cost: 0,
      description: 'Livraison à vélo (Montreuil)',
      userDefinedId: 'livraison_velo'
    };
    // Colissimo
    const rate_colissimo = {
      cost: 5,
      description: 'Colissimo',
      userDefinedId: 'livraison_colissimo'
    };
    // Lettre suivie
    const rate_lettre = {
      cost: 3,
      description: 'Lettre suivie',
      userDefinedId: 'livraison_lettre'
    };
    // Colissimo + Lettre suivie
    const rate_2 = {
      cost: 8,
      description: 'Colissimo + Lettre suivie (envoi séparé)',
      userDefinedId: 'livraison_colissimo_lettre'
    };

    // Livraison à Montreuil
    if (obj.content.shippingAddressPostalCode == '93100') {
      rates.push(rate_montreuil);
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
    // Emballage selon le format
    if (a3 >= 1 && a5 >= 1) {
      rates.push(rate_2);
    } else if (a3 >= 1 && a5 == 0) {
      rates.push(rate_colissimo);
    } else if (a5 >= 1 && a3 == 0) {
      rates.push(rate_lettre);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rates: rates
      })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errors: [{
          key: 'error',
          message: 'Impossible d\'afficher les modes de livraison.'
        }]
      })
    };
  }
};