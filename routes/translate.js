const express = require("express");
const protect = require("../middleware/authMiddleware");
const translateControllers = require("../controllers/translate-constrollers");

const router = express.Router();

router.get("/", translateControllers.getLanguagesList);

router
  .route("/list")
  .post(protect, translateControllers.saveToList)
  .get(protect, translateControllers.getList)
  .patch(protect, translateControllers.updateWordCounter);

router
  .route("/list/:id")
  .get(protect, translateControllers.getWordById)
  .delete(protect, translateControllers.deleteWordById)
  .put(protect, translateControllers.editWord);

router
  .route("/cards")
  .post(protect, translateControllers.saveCard)
  .get(protect, translateControllers.getCardsList);

router.post("/flashcards", translateControllers.getLanguagesList);

router.get(
  "/translate/:word/:from/:to",
  translateControllers.translateSentence
);

router.get(
  "/translate/listen/:word/:from/:to",
  translateControllers.getTextToSpeech
);

module.exports = router;
