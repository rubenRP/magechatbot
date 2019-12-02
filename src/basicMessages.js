const { MessageFactory } = require("botbuilder");

const BasicMessages = {};

const BasicOptions = ["Search", "Restart", "Help"];

BasicMessages.sendWelcomeMessage = async turnContext => {
  const { membersAdded } = turnContext.activity;

  for (let cnt = 0; cnt < membersAdded.length; cnt += 1) {
    if (membersAdded[cnt].id !== turnContext.activity.recipient.id) {
      const welcomeMessage = "Welcome to MageChatbot.";
      // eslint-disable-next-line no-await-in-loop
      await turnContext.sendActivity(welcomeMessage);
    }
  }
};

BasicMessages.sendSuggestedActions = async turnContext => {
  const reply = MessageFactory.suggestedActions(
    BasicOptions,
    "What do you want to do?"
  );
  await turnContext.sendActivity(reply);
};

BasicMessages.printHelpInfo = async turnContext => {
  await turnContext.sendActivity(
    "MageBot is a chatbot that allows you to interact with a magento store using a conversational way."
  );
  await turnContext.sendActivity(
    "You can search products, add to cart and buy your products."
  );
  await turnContext.sendActivity(
    "Also, if you are registered in the Magento store, you can log in, add to cart, and save the session."
  );
  await turnContext.sendActivity(
    "Always you can type 'Help' to show help options"
  );
};

module.exports.BasicMessages = BasicMessages;
