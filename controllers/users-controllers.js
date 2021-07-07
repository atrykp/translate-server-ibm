const generateToken = require("../utils/generateToken");
const User = require("../models/user-model");
const TranslationList = require("../models/translation-list-model");
const Flashcards = require("../models/flashcards-model");
const bcrypt = require("bcrypt");

const user = new User();

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: "user already exist" });
    return;
  }
  try {
    await User.create({
      name,
      email,
      password,
    });
    res.send("user created");
  } catch (error) {
    res.json({ message: error.message, status: 400 });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (user && isCorrectPass) {
      const token = generateToken(user._id);
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      throw new Error("email or password incorect");
    }
  } catch (error) {
    res.send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      res.send(new Error("word not found"));
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};

const editUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const keys = Object.keys(req.body);
    const user = await User.findById(userId);
    if (!user) throw new Error("user not found");
    for (const val of keys) {
      user[val] = req.body[val];
    }
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
};

const removeUser = async (req, res) => {
  const userId = req.user._id;
  try {
    await User.findByIdAndRemove(userId);
    await Flashcards.findOneAndRemove({ user: userId });
    await TranslationList.findOneAndRemove({
      user: userId,
    });
    res.send({ message: "user deleted" });
  } catch (error) {
    res.send(error);
  }
};

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
module.exports.getUserById = getUserById;
module.exports.editUser = editUser;
module.exports.removeUser = removeUser;
