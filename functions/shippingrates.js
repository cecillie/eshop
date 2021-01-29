exports.handler = async ({ body, headers }) => {
  try {
    const obj = JSON.parse(body);

    // default rates
    rates = [{
      cost: 2,
      description: 'Livraison à vélo (Montreuil)',
      userDefinedId: 'shipping_20',
    }, {
      cost: 0,
      description: 'Retrait (Paris 20ème)',
      userDefinedId: 'shipping_30'
    }];

    // A3
    rate_tube = [{
      cost: 10,
      description: 'Colissimo (tube)',
      userDefinedId: 'colissimo_tube',
    }];

    // A5
    rate_enveloppe = [{
      cost: 8,
      description: 'Colissimo (enveloppe)',
      userDefinedId: 'colissimo_enveloppe',
    }];

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
