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
      throw new Error("Invalid token");
    }
  }

  if (!token || !req.headers.authorization) {
    res.status(401);
    throw new Error("No token");
  }
};

module.exports = protect;
