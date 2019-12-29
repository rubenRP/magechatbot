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
        region_id: 161,
        region_code: "Madrid",
        country_id: "ES",
        street: [shippingData.street],
        postcode: shippingData.postcode,
        city: shippingData.city,
        firstname: shippingData.name,
        lastname: shippingData.lastname,
        email: shippingData.email,
        telephone: shippingData.phone,
        sameAsBilling: 1
      },
      billing_address: {
        region_id: 161,
        region_code: "Madrid",
        region: shippingData.region,
        country_id: "ES",
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
  console.log("SetPayment and order");
  console.log(shippingData);

  const billingInfo = {
    paymentMethod: {
      method: "banktransfer"
    }
  };

  console.log(billingInfo);

  const result = await client.cart.order(customerToken, cartId, billingInfo);

  if (!result.code) {
    await turnContext.sendActivity(`Order success!`);
    await turnContext.sendActivity(`Order nº ${result}`);
    await turnContext.sendActivity(
      `You can check the order status in http://tfm.rubenr.es/`
    );
  } else {
    await turnContext.sendActivity(`Error: ${result.message}`);
  }
  console.log(result);
  return result;
};

module.exports.Checkout = Checkout;
