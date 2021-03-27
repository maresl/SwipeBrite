const jwt = require("jsonwebtoken");
const createToken = (user) => {
  //backend team decide token data
  const payload = {
    email: user.email,
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  return token;
};

const decodeUser = (token) => {
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = {
  createToken,
  decodeUser,
};
