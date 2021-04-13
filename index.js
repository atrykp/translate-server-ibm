const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.listen(port);
app.use(express.json({ limit: "1mb" }));

const corsOptions = {
  origin: ["https://pensive-lalande-2ecd72.netlify.app"],
};

const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: `${process.env.API_KEY}`,
  }),

  serviceUrl: `${process.env.API_URL}`,
});

const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: `${process.env.API_LISTEN_KEY}`,
  }),
  serviceUrl: `${process.env.API_LISTEN_URL}`,
});

app.get("/", cors(corsOptions), async (request, response) => {
  const languages = await languageTranslator.listLanguages();
  response.json(languages);
});

app.get(
  "/translate/:word/:from/:to",
  cors(corsOptions),
  async (request, response) => {
    const translateThis = request.params.word;

    const translateParams = {
      text: translateThis,
      source: request.params.from,
      target: request.params.to,
    };

    const translateResponse = await languageTranslator.translate(
      translateParams
    );

    response.json(translateResponse);
  }
);

app.get(
  "/translate/listen/:word/:from/:to",
  cors(corsOptions),
  async (request, response) => {
    const translateThis = request.params.word;

    const synthesizeParams = {
      text: "Hello world",
      accept: "audio/wav",
      voice: "en-US_AllisonV3Voice",
    };

    textToSpeech
      .synthesize(synthesizeParams)
      .then((response) => {
        // only necessary for wav formats,
        // otherwise `response.result` can be directly piped to a file
        return textToSpeech.repairWavHeaderStream(response.result);
      })
      .then((buffer) => {
        fs.writeFileSync("hello_world.wav", buffer);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }
);
