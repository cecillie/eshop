exports.handler = async ({ body, headers }) => {
  try {
    const obj = JSON.parse(body);

    // Retrait dans le 20ème
    rates = [{
      cost: 0,
      description: 'Retrait (Paris 20ème)',
      userDefinedId: 'retrait'
    }];
    // Livraison à vélo
    rate_montreuil = {
      cost: 2,
      description: 'Livraison à vélo (Montreuil)',
      userDefinedId: 'livraison_velo'
    };
    // Colissimo
    rate_colissimo = {
      cost: 10,
      description: 'Colissimo',
      userDefinedId: 'livraison_colissimo'
    };
    // Lettre suivie
    rate_lettre = {
      cost: 8,
      description: 'Lettre suivie',
      userDefinedId: 'livraison_lettre'
    };
    // les 2
    rate_2 = {
      cost: 18,
      description: 'Colissimo + Lettre suivie (envoi séparé)',
      userDefinedId: 'livraison_colissimo_lettre'
    };

    // Montreuil
    if (obj.content.shippingAddressPostalCode == '93100') {
      rates.push(rate_montreuil);
    }
    // Formats
    let a3 = 0;
    let a5 = 0;
    for (var i = 0; i < obj.content.items.length; i++) {
      if (obj.content.items[i].customFields[0].value == 'A3') {
        a3 = a3 + 1;
      }
      if (obj.content.items[i].customFields[0].value == 'A5') {
        a5 = a5 + 1;
      }
    }
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
          key: 'error_code',
          message: 'Erreur.'
        }]
      })
    };
  }
};
