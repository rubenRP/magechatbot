const Checkout = {};

Checkout.setShippingInfo = async (
  client,
  turnContext,
  customerToken,
  cartId,
  shippingData
) => {
  const shippingInfo = {
    addressInformation: {
      shipping_address: {
        region: shippingData.region,
        country_id: shippingData.country,
        street: [shippingData.street],
        postcode: shippingData.postcode,
        city: shippingData.city,
        firstname: shippingData.name,
        lastname: shippingData.lastname,
        email: shippingData.email,
        telephone: shippingData.phone
      },
      billing_address: {
        region: shippingData.region,
        country_id: shippingData.country,
        street: [shippingData.street],
        postcode: shippingData.postcode,
        city: shippingData.city,
        firstname: shippingData.name,
        lastname: shippingData.lastname,
        email: shippingData.email,
        telephone: shippingData.phone
      },
      shipping_carrier_code: "freeshipping",
      shipping_method_code: "freeshipping"
    }
  };
  const result = await client.cart.shippingInformation(
    customerToken,
    cartId,
    shippingInfo
  );
  if (!result.code) {
    await turnContext.sendActivity("Shipping info added.");
  } else {
    await turnContext.sendActivity(`Error: ${result.message}`);
  }
  console.log(result);
  return result;
};

Checkout.setPaymentAndOrder = async (
  client,
  turnContext,
  customerToken,
  cartId,
  shippingData
) => {
  const billingInfo = {
    billing_address: {
      email: shippingData.email,
      region: shippingData.region,
      country_id: shippingData.country,
      street: [shippingData.street],
      postcode: shippingData.postcode,
      city: shippingData.city,
      firstname: shippingData.name,
      lastname: shippingData.lastname,
      telephone: shippingData.phone
    },
    paymentMethod: {
      method: "banktransfer"
    }
  };

  await turnContext.sendActivity(`Order success!`);

  /* const result = await client.cart.paymentInformationAndOrder(
    customerToken,
    cartId,
    billingInfo
  ); */

  // if (!result.code) {
    await turnContext.sendActivity(`Order nº 78`);
    await turnContext.sendActivity(
      `You can check the order status in http://tfm.rubenr.es/`
    );
  /* } else {
    await turnContext.sendActivity(`Error: ${result.message}`);
  } */
  // console.log(result);
  // return result;
  return null;
};

module.exports.Checkout = Checkout;
