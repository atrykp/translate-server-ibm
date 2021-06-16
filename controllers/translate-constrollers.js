const ibmTranslate = require("../IBM/ibm-translate");
const User = require("../models/user-model");
const TranslationList = require("../models/translation-list-model");
const fs = require("fs");
const path = require("path");

const getLanguagesList = async (request, response, next) => {
  let languages;
  try {
    languages = await ibmTranslate.languageTranslator.listLanguages();
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
    translateResponse = await ibmTranslate.languageTranslator.translate(
      translateParams
    );
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

  ibmTranslate.textToSpeech
    .synthesize(synthesizeParams)
    .then((response) => {
      return ibmTranslate.textToSpeech.repairWavHeaderStream(response.result);
    })
    .then((buffer) => {
      fs.writeFileSync(`${__dirname}/${translateThis}.wav`, buffer);
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
};

const saveToList = async (req, res) => {
  const translation = await new TranslationList({
    user: req.user._id,
    translationList: req.body,
  });
  try {
    const user = await TranslationList.findOne({ user: req.user._id });
    if (user) {
      user.translationList.push(translation.translationList[0]);
      await user.save();
      res.send("added");
    } else {
      await translation.save();
      res.send("saved new one");
    }
  } catch (error) {
    res.send(error);
  }
};

exports.getLanguagesList = getLanguagesList;
exports.translateSentence = translateSentence;
exports.getTextToSpeech = getTextToSpeech;
exports.saveToList = saveToList;
