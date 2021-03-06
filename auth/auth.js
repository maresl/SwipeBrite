const jwt = require("./jwt");

const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const user = jwt.decodeUser(token);
      req.user = user;
      next();
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

const optionalAuthenticateJWT = (req, res, next) => {

  try {

    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decodeUser(token);
      req.user = user;
      next();
    } else {
      next()
    }
  } catch (error) {
    res.sendStatus(401);
  }
};
module.exports = {
  authenticateJWT,
  optionalAuthenticateJWT
}

