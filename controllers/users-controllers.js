const generateToken = require("../utils/generateToken");
const User = require("../models/user-model");
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

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
