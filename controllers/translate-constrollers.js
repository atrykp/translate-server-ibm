const fs = require("fs");
const path = require("path");
const http = require("http");

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

const getLanguagesList = async (request, response, next) => {
  let languages;
  try {
    languages = await languageTranslator.listLanguages();
  } catch (err) {
    return next(err);
  }
  response.json(languages);
};

const translateSentence = async (request, response, next) => {
  const translateThis = request.params.word;

  const translateParams = {
    text: translateThis,
    source: request.params.from,
    target: request.params.to,
  };
  let translateResponse;
  try {
    translateResponse = await languageTranslator.translate(translateParams);
  } catch (error) {
    return next(error);
  }

  response.json(translateResponse);
};

const getTextToSpeech = async (request, response) => {
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
      console.log(response);
    })
    .then((buffer) => {
      console.log(buffer);

      fs.writeFileSync(`${__dirname}/${translateThis}.wav`, buffer);
      const filePath = path.join(__dirname, `${translateThis}.wav`);
      console.log(__dirname, "ścieżka pliku");
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
};

exports.getLanguagesList = getLanguagesList;
exports.translateSentence = translateSentence;
exports.getTextToSpeech = getTextToSpeech;
