exports.handler = async ({ body, headers }) => {
  try {
    const obj = JSON.parse(body);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errors: [{
          key: 'invalid_postal_code',
          message: 'The postal code is invalid.'
        }]
      })
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rates: [{
          cost: 10,
          description: '10$ shipping',
          userDefinedId: 'shipping_10',
        }, {
          cost: 20,
          description: '20$ shipping',
          guaranteedDaysToDelivery: 5,
          userDefinedId: 'shipping_20',
        }, {
          cost: 30,
          description: '30$ shipping',
          userDefinedId: 'shipping_30'
        }]
      })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
