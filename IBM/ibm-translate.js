const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: `${process.env.API_KEY}`,
  }),

  serviceUrl: `${process.env.API_URL}`,
});

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: `${process.env.API_LISTEN_KEY}`,
  }),
  serviceUrl: `${process.env.API_LISTEN_URL}`,
});

exports.languageTranslator = languageTranslator;
exports.textToSpeech = textToSpeech;
