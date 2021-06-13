const User = require("../models/user-model");

const user = new User();
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  User.create({
    name,
    email,
    password,
  });
  res.send("all ok");
};

const userLogin = async (req, res) => {};

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
