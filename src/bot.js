/* eslint-disable no-fallthrough */
const { ActivityHandler, MessageFactory } = require("botbuilder");
const { Magento2Client } = require("magento2-rest-client");

const { BasicMessages } = require("./modules/basicMessages");
const { Product } = require("./modules/product");
const { Cart } = require("./modules/cart");
const { Checkout } = require("./modules/checkout");
const { apiConfig } = require("./config/data.json");

const { ShippingDialog } = require("./dialogs/shippingDialog");

// The accessor names for the conversation data and user profile state property accessors.
const CONVERSATION_DATA_PROPERTY = "conversationData";
const USER_PROFILE_PROPERTY = "userProfile";
const client = Magento2Client(apiConfig);

/**
 *
 *
 * @class MageChatbot
 * @extends {ActivityHandler}
 */
class MageChatbot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();
    // Create the state property accessors for the conversation data and user profile.
    this.conversationDataAccessor = conversationState.createProperty(
      CONVERSATION_DATA_PROPERTY
    );
    this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

    // The state management objects for the conversation and user state.
    this.conversationState = conversationState;
    this.userState = userState;

    this.shippingDialog = new ShippingDialog(userState);
    this.sippingDialogState = this.conversationState.createProperty(
      "ShippingDialogState"
    );

    this.onMembersAdded(async (context, next) => {
      await BasicMessages.sendWelcomeMessage(context);
      await BasicMessages.sendSuggestedActions(context);
      await next();
    });

    this.onMessage(async (turnContext, next) => {
      // Get the state properties from the turn context.
      const userProfile = await this.userProfileAccessor.get(turnContext, {});
      const conversationData = await this.conversationDataAccessor.get(
        turnContext,
        {
          botState: 1
        }
      );
      let products;
      let product;
      let images;
      let reply;
      let response;

      console.log(`User text: ${turnContext.activity.text}`);

      if (
        turnContext.activity.text.toLowerCase() === "help" ||
        turnContext.activity.text.toLowerCase() === "/help"
      ) {
        await BasicMessages.printHelpInfo(turnContext);
        conversationData.botState = -1;
      }

      // Conditional Switch cases
      switch (conversationData.botState) {
        // Help switch case
        case 10:
          console.log("Case 10 HELP");
          if (
            turnContext.activity.text.toLowerCase() === "search" ||
            turnContext.activity.text.toLowerCase() === "/search"
          ) {
            conversationData.botState = 1;
          } else if (
            turnContext.activity.text.toLowerCase() === "restart" ||
            turnContext.activity.text.toLowerCase() === "/restart" ||
            turnContext.activity.text.toLowerCase() === "/start"
          ) {
            userProfile.customerToken = null;
            userProfile.customerId = null;
            userProfile.cartId = null;
            conversationData.botState = -1;
          } else {
            conversationData.botState = -1;
          }
          break;
        // Product view switch case
        case 11:
          console.log("Case 11");
          console.log(turnContext.activity.text);

          switch (turnContext.activity.text) {
            case "Yes":
              conversationData.botState = 4;
              break;
            case "Show Similar Products":
              conversationData.botState = 3;
              break;
            default:
              conversationData.botState = 1;
              break;
          }
          break;
        // Cart case to checkout or
        case 12:
          console.log("Case 12");
          if (
            turnContext.activity.text.toLowerCase() === "checkout" ||
            turnContext.activity.text.toLowerCase() === "/checkout"
          ) {
            conversationData.botState = 5;
          } else {
            conversationData.botState = -1;
          }
          break;
        default:
      }

      // Regular Switch cases
      switch (conversationData.botState) {
        // Initial search message
        case 1:
          console.log("Case 1");
          await turnContext.sendActivity("What product do you want to search?");
          conversationData.botState += 1;
          break;
        // Product search case
        case 2:
          console.log("Case 2");
          await turnContext.sendActivity("Searching...");
          userProfile.productQuery = turnContext.activity.text;
          products = await Product.searchProduct(
            client,
            userProfile.productQuery
          );
          if (products.items.length) {
            // console.log(Object.values(products.items)[0]);
            userProfile.productItems = products.items;
            userProfile.productObject = userProfile.productItems.shift();
            // [userProfile.productObject] = Object.values(products.items);
            product = userProfile.productObject;
            images = await Product.getProductImageList(client, product.sku);

            await Product.showProduct(turnContext, product, images);

            reply = MessageFactory.suggestedActions(
              ["Yes", "No", "Show Similar Products"],
              "Do you want to add this product to cart?"
            );
            conversationData.botState = 11;
            await turnContext.sendActivity(reply);
          } else {
            conversationData.botState = -1;
            await turnContext.sendActivity("There aren't products");
          }
          break;

        // Show similar products case
        case 3:
          console.log("Case 3");
          userProfile.productObject = userProfile.productItems.shift();

          if (userProfile.productObject) {
            product = userProfile.productObject;
            images = await Product.getProductImageList(client, product.sku);

            await Product.showProduct(turnContext, product, images);

            reply = MessageFactory.suggestedActions(
              ["Yes", "No", "Show Similar Products"],
              "Do you want to add this product to cart?"
            );
            conversationData.botState = 11;
            await turnContext.sendActivity(reply);
          } else {
            conversationData.botState = -1;
            await turnContext.sendActivity("There aren't products");
          }
          break;

        // Add to cart step
        case 4:
          console.log("Case 4");
          if (!userProfile.cartId) {
            console.log("Create Cart");
            userProfile.cartId = await Cart.createCart(
              client,
              userProfile.customerToken,
              userProfile.customerId
            );
          }

          console.log("Add to cart");
          response = await Cart.addToCart(
            client,
            turnContext,
            userProfile.customerToken,
            userProfile.cartId,
            userProfile.productObject.sku
          );

          response = await Cart.getCartStatus(
            client,
            turnContext,
            userProfile.customerToken,
            userProfile.cartId
          );

          reply = MessageFactory.suggestedActions(
            ["Checkout", "Continue shopping"],
            "Do yo want to continue shopping or checkout?"
          );
          conversationData.botState = 12;
          await turnContext.sendActivity(reply);

          break;

        // Checkout
        case 5:
          console.log("Case 5");
          response = await this.shippingDialog.run(
            turnContext,
            this.sippingDialogState
          );
          if (response && response.status === "complete") {
            await turnContext.sendActivity(
              "We only ship to Spain with free shipping, so we have simplified the checkout steps"
            );
            await turnContext.sendActivity(
              "The default payment method for this store is Check / MoneyOrder"
            );

            userProfile.shippingInfo = response.result;
            response = await Checkout.setShippingInfo(
              client,
              turnContext,
              userProfile.customerToken,
              userProfile.cartId,
              userProfile.shippingInfo
            );
            response = await Checkout.setPaymentAndOrder(
              client,
              turnContext,
              userProfile.customerToken,
              userProfile.cartId,
              userProfile.shippingInfo
            );
            userProfile.cartId = null;
            conversationData.botState = 10;
            await BasicMessages.sendSuggestedActions(turnContext);
          }

          break;

        default:
          console.log("Default Case");
          conversationData.botState = 10;
          await BasicMessages.sendSuggestedActions(turnContext);
          break;
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onDialog(async (turnContext, next) => {
      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(turnContext, false);
      await this.userState.saveChanges(turnContext, false);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.MageChatbot = MageChatbot;
