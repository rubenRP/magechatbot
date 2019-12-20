const { ActivityTypes } = require("botbuilder");
const { storeConfig } = require("../config/data.json");

const Product = {};

Product.searchProduct = async (client, query) => {
  const searchCriteria =
    `${"&searchCriteria[filter_groups][0][filters][0][field]=name&" +
      "searchCriteria[filter_groups][0][filters][0][value]=%25"}${query}%25&` +
    `searchCriteria[filter_groups][0][filters][0][condition_type]=like&` +
    `searchCriteria[pageSize]=10`;
  const result = await client.products.list(searchCriteria);

  if (result.code) {
    console.log("Result");
    console.log(`Error: ${result.message}`);
    return null;
  }
  // console.log(result);
  return result;
};

Product.getProductImageList = async (client, sku) => {
  const result = await client.productMedia.list(sku);
  if (result.code) {
    console.log(`Error: ${result.message}`);
    return null;
  }
  return result;
};
Product.getProductImage = async (client, sku, imageId) => {
  const result = await client.productMedia.get(sku, imageId);
  if (result.code) {
    console.log(`Error: ${result.message}`);
    return null;
  }
  return result;
};

Product.showProduct = async (turnContext, product, images) => {
  await turnContext.sendActivity("We just find this results...");

  if (images.length) {
    const productImage = storeConfig.mediaProductUrl + images[0].file;
    const testImage = {
      contentType: "image/jpeg",
      contentUrl: productImage
    };
    const replyImage = { type: ActivityTypes.Message };
    replyImage.attachments = [testImage];
    await turnContext.sendActivity(replyImage);
  }

  await turnContext.sendActivity(
    `Product Info: \n
  Name: ${product.name} \n
  Sku: ${product.sku} \n
  Price: ${product.price}€`
  );

  return 1;
};

module.exports.Product = Product;
