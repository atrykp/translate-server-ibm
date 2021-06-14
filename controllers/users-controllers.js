const User = require("../models/user-model");

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

const userLogin = async (req, res) => {};

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
