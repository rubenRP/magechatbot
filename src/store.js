const Store = {};

Store.getStoreConfig = async (client) => {
  const endpointUrl = client.util.format('/stores/storeConfig');
  const result = await client.restClient.get(endpointUrl);
  console.log('Store CONFIG');
  console.log(result);
  return result;
};

module.exports.Store = Store;
