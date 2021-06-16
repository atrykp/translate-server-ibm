const mongoose = require("mongoose");
const { Schema } = mongoose;

const translationListSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  translationList: [
    {
      id: { type: String, require: true },
      counter: { type: Number, require: true },
      fromWord: { type: String, require: true },
      toWord: { type: String, require: true },
      fromLang: { type: String, require: true },
      toLang: { type: String, require: true },
    },
  ],
});

module.exports = mongoose.model("TranslationList", translationListSchema);
