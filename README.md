# MageChatbot

Create a conversational way to interact with Magento API

This bot has been created using [Bot Framework](https://dev.botframework.com) and interacts with Magento Api throught [Divante Magento 2 REST client](https://github.com/DivanteLtd/magento2-rest-client)

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

  ```bash
  # determine node version
  node --version
  ```

## Config

Is necessary to create a src/config/data.json file and fill the API Credentials for Magento 2. You can check the data.json.example as follows:

```json
{
  "apiConfig": {
    "url": "http://magentoshop.com/rest",
    "consumerKey": "aaa",
    "consumerSecret": "bbb",
    "accessToken": "ccc",
    "accessTokenSecret": "ddd"
  },
  "storeConfig": {
    "url": "http://.magentoshop.com/",
    "mediaProductUrl": "http://magentoshop.com/pub/media/catalog/product"
  },
  "options": {}
}
```

## To run the bot

- Install modules

  ```bash
  npm install
  ```

- Start the bot

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.3.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`
