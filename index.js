const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.listen(port);
app.use(express.json({ limit: "1mb" }));

const corsOptions = {
  origin: "https://pensive-lalande-2ecd72.netlify.app",
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
      text: translateThis,
      accept: "audio/wav",
      voice: "en-US_AllisonV3Voice",
    };

    textToSpeech
      .synthesize(synthesizeParams)
      .then((response) => {
        return textToSpeech.repairWavHeaderStream(response.result);
      })
      .then((buffer) => {
        fs.writeFileSync(`${translateThis}.wav`, buffer);
        const filePath = path.join(__dirname, `${translateThis}.wav`);
        const stat = fs.statSync(filePath);
        response.writeHead(200, {
          "Content-Type": "audio/wav",
          "Content-Length": stat.size,
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
        fs.unlinkSync(filePath);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }
);
