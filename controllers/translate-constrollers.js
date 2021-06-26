const ibmTranslate = require("../IBM/ibm-translate");
const User = require("../models/user-model");
const TranslationList = require("../models/translation-list-model");
const Flashcards = require("../models/flashcards-model");
const fs = require("fs");
const path = require("path");
const AppError = require("../utils/appError");

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
      const data = await user.save();
      const length = data.translationList.length;

      res.send(data.translationList[length - 1]);
    } else {
      await translation.save();
      res.send("saved new one");
    }
  } catch (error) {
    res.send(error);
  }
};

const updateWordCounter = async (req, res) => {
  const wordId = req.body.id;

  try {
    await TranslationList.updateOne(
      { user: req.user._id, "translationList._id": wordId },
      {
        $inc: {
          "translationList.$.counter": 1,
        },
      }
    );
    res.send({ message: "counter updated" });
  } catch (error) {
    res.send(error);
  }
};

const getList = async (req, res) => {
  const id = req.user._id;
  if (!id) {
    const err = new Error("user error");
    res.send(err);
  }
  try {
    const userList = await TranslationList.findOne({ user: id });

    if (!userList) {
      res.status(404);
      res.send(new Error("user list not found"));
    }

    res.json({ userList: userList.translationList });
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};
const getWordById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await TranslationList.findOne({
      user: req.user._id,
    });

    const [sentence] = user.translationList.filter(
      (element) => element._id == id
    );

    if (!sentence) {
      res.status(404);
      res.send(new Error("word not found"));
      return;
    }

    res.json(sentence);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};
const deleteWordById = async (req, res) => {
  const wordId = req.params.id;

  try {
    const user = await TranslationList.findOne({ user: req.user._id });
    user.translationList = user.translationList.filter((elem) => {
      return elem._id.toString() !== wordId;
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};
const editWord = async (req, res) => {
  const wordId = req.params.id;

  try {
    const keys = Object.keys(req.body);
    const user = await TranslationList.findOne({ user: req.user._id });
    if (!user) throw new Error("user not found");
    const [translation] = user.translationList.filter(
      (element) => element._id.toString() === wordId
    );

    for (const val of keys) {
      translation[val] = req.body[val];
    }
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};

//Flashcards controllers

const saveCard = async (req, res) => {
  const flashcard = await new Flashcards({
    user: req.user._id,
    flashcards: req.body,
  });
  try {
    const user = await Flashcards.findOne({ user: req.user._id });
    if (user) {
      user.flashcards.push(flashcard.flashcards[0]);
      const data = await user.save();
      const length = data.flashcards.length;
      res.send(data.flashcards[length - 1]);
    } else {
      await flashcard.save();
      res.send(flashcard);
    }
  } catch (error) {
    res.send(error);
  }
};
const getCardsList = async (req, res) => {
  try {
    const [flashcardsList] = await Flashcards.find({
      user: req.user._id,
    });
    res.send(flashcardsList.flashcards);
  } catch (error) {
    res.send(error);
  }
};

exports.getLanguagesList = getLanguagesList;
exports.translateSentence = translateSentence;
exports.getTextToSpeech = getTextToSpeech;
exports.saveToList = saveToList;
exports.getList = getList;
exports.updateWordCounter = updateWordCounter;
exports.getWordById = getWordById;
exports.deleteWordById = deleteWordById;
exports.editWord = editWord;
exports.saveCard = saveCard;
exports.getCardsList = getCardsList;
