const jwt = require("jsonwebtoken");
function generateToken(id) {
  const token = jwt.sign({ id }, process.env.SECRET_WORD, {
    expiresIn: "1h",
  });
  return token;
}

module.exports = generateToken;
