const Cart = {};

Cart.createCart = async (client, customerToken, customerId) => {
  const result = await client.cart.create(customerToken, customerId);
  return result;
};

Cart.addToCart = async (
  client,
  turnContext,
  customerToken,
  cartId,
  cartSku
) => {
  const cartItem = {
    sku: cartSku,
    qty: 1,
    quote_id: cartId
  };
  const result = await client.cart.update(customerToken, cartId, cartItem);
  if (!result.code) {
    await turnContext.sendActivity("Product added to cart.");
  } else {
    await turnContext.sendActivity(`Error: ${result.message}`);
  }

  return result;
};

Cart.getCartStatus = async (client, turnContext, customerToken, cartId) => {
  const result = await client.cart.totals(customerToken, cartId);
  if (!result.code) {
    await turnContext.sendActivity("Products in cart:");
    result.items.forEach(async item => {
      await turnContext.sendActivity(`Name: ${item.name}. Qty: ${item.qty}`);
    });
    await turnContext.sendActivity(`Total: ${result.grand_total}€`);
  } else {
    await turnContext.sendActivity(`Error: ${result.message}`);
  }
  return result;
};

module.exports.Cart = Cart;
