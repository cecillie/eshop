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
    // Tube
    rate_tube = {
      cost: 10,
      description: 'Colissimo (tube)',
      userDefinedId: 'colissimo_tube'
    };
    // Enveloppe
    rate_enveloppe = {
      cost: 8,
      description: 'Colissimo (enveloppe)',
      userDefinedId: 'colissimo_enveloppe'
    };

    // Montreuil
    if (obj.content.shippingAddressPostalCode == '93100') {
      rates.push(rate_montreuil);
    }
    // Format A3
    for (var i = 0; i < obj.content.items.length; i++) {
      if (obj.content.items[i].customFields[0].value == 'A3') {
        rates.push(rate_tube);
      }
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
