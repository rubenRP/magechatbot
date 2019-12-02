/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-return-await */
const { MessageFactory } = require("botbuilder");
const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog
} = require("botbuilder-dialogs");

const NAME_PROMPT = "NAME_PROMPT";
const LASTNAME_PROMPT = "LASTNAME_PROMPT";
const EMAIL_PROMPT = "EMAIL_PROMPT";
const PHONE_PROMPT = "PHONE_PROMPT";
const STREET_PROMPT = "STREET_PROMPT";
const POSTCODE_PROMPT = "POSTCODE_PROMPT";
const CITY_PROMPT = "CITY_PROMPT";
const REGION_PROMPT = "REGION_PROMPT";
const COUNTRY_PROMPT = "COUNTRY_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";

class ShippingDialog extends ComponentDialog {
  constructor(userState) {
    super("shippingDialog");

    this.userProfile = userState.createProperty(USER_PROFILE);

    this.addDialog(new TextPrompt(NAME_PROMPT));
    this.addDialog(new TextPrompt(LASTNAME_PROMPT));
    this.addDialog(new TextPrompt(EMAIL_PROMPT));
    this.addDialog(new TextPrompt(PHONE_PROMPT));
    this.addDialog(new TextPrompt(STREET_PROMPT));
    this.addDialog(new TextPrompt(POSTCODE_PROMPT));
    this.addDialog(new TextPrompt(CITY_PROMPT));
    this.addDialog(new TextPrompt(REGION_PROMPT));
    this.addDialog(new TextPrompt(COUNTRY_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.nameStep.bind(this),
        this.lastnameStep.bind(this),
        this.emailStep.bind(this),
        this.phoneStep.bind(this),
        this.streetStep.bind(this),
        this.postcodeStep.bind(this),
        this.cityStep.bind(this),
        this.regionStep.bind(this),
        this.countryStep.bind(this),
        this.confirmStep.bind(this)
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  // eslint-disable-next-line consistent-return
  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
    if (results.status === "complete") {
      return results;
    }
  }

  async nameStep(step) {
    return await step.prompt(NAME_PROMPT, "Name:");
  }

  async lastnameStep(step) {
    step.values.name = step.result;
    return await step.prompt(LASTNAME_PROMPT, "Lastname:");
  }

  async emailStep(step) {
    step.values.lastname = step.result;
    return await step.prompt(EMAIL_PROMPT, "Email:");
  }

  async phoneStep(step) {
    step.values.email = step.result;
    return await step.prompt(PHONE_PROMPT, "Phone:");
  }

  async streetStep(step) {
    step.values.phone = step.result;
    return await step.prompt(STREET_PROMPT, "Street:");
  }

  async postcodeStep(step) {
    step.values.street = step.result;
    return await step.prompt(POSTCODE_PROMPT, "Postcode:");
  }

  async cityStep(step) {
    step.values.postcode = step.result;
    return await step.prompt(CITY_PROMPT, "City:");
  }

  async regionStep(step) {
    step.values.city = step.result;
    return await step.prompt(REGION_PROMPT, "Region:");
  }

  async countryStep(step) {
    step.values.region = step.result;
    return await step.prompt(REGION_PROMPT, "Country code:");
  }

  async confirmStep(step) {
    step.values.country = step.result;
    return await step.endDialog(step.values);
  }
}

module.exports.ShippingDialog = ShippingDialog;
