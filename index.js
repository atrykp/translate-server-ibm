const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.listen(port);
app.use(express.json({ limit: "1mb" }));
app.use(cors());

const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: `${process.env.API_KEY}`,
  }),

  serviceUrl: `${process.env.API_URL}`,
});

app.get("/", async (request, response) => {
  const languages = await languageTranslator.listLanguages();
  response.json(languages);
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
