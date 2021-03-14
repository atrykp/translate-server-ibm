const { json } = require("express");
const express = require("express");
require("dotenv").config();
const app = express();
app.listen(5000, () => {
  console.log("listen on port 5000");
});
app.use(express.json({ limit: "1mb" }));

const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
  disableSslVerification: true,
});

app.get("/translate/:word", async (request, response) => {
  const translateThis = request.params.word;
  const translateParams = {
    text: translateThis,
    source: "en",
    target: "pl",
  };
  const translateResponse = await languageTranslator.translate(translateParams);

  response.json(translateResponse);
});
