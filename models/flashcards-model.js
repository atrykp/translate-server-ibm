const mongoose = require("mongoose");
const { Schema } = mongoose;

const flashcardsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  flashcards: [
    {
      id: { type: String, require: true },
      iCan: { type: Boolean, require: true },
      fromWord: { type: String, require: true },
      toWord: { type: String, require: true },
      fromLang: { type: String, require: true },
      toLang: { type: String, require: true },
    },
  ],
});

module.exports = mongoose.model("Flashcards", flashcardsSchema);
