exports.handler = async ({ body, headers }) => {
  try {
    const obj = JSON.parse(body);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rates: [{
          cost: 10,
          description: 'Mode de livraison 1',
          userDefinedId: 'shipping_10',
        }, {
          cost: 20,
          description: 'Mode de livraison 2',
          userDefinedId: 'shipping_20',
        }, {
          cost: 30,
          description: 'Mode de livraison 3',
          userDefinedId: 'shipping_30'
        }]
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
