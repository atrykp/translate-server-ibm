const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const data = jwt.verify(token, process.env.SECRET_WORD);
      req.user = await User.findById(data.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      const err = new Error("Invalid token");
      res.send(err.message);
    }
  }

  if (!token || !req.headers.authorization) {
    res.status(401);
    const err = new Error("No token");
    res.send(err.message);
  }
};

module.exports = protect;
