exports.handler = async ({ body, headers }) => {
  try {
    const obj = JSON.parse(body);

    let found = obj.find(e => e.value === 'A3');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(found)
    };

    // default rates
    rates = [{
      cost: 0,
      description: 'Retrait (Paris 20ème)',
      userDefinedId: 'retrait'
    }];
    // Montreuil
    rate_montreuil = {
      cost: 2,
      description: 'Livraison à vélo (Montreuil)',
      userDefinedId: 'livraison_velo'
    };
    // A3
    rate_tube = {
      cost: 10,
      description: 'Colissimo (tube)',
      userDefinedId: 'colissimo_tube'
    };
    // A5
    rate_enveloppe = {
      cost: 8,
      description: 'Colissimo (enveloppe)',
      userDefinedId: 'colissimo_enveloppe'
    };

    if (obj.content.shippingAddressPostalCode == '93100') {
      rates.push(rate_montreuil);
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
