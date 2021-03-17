const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../auth/jwt");

const create = async (req, res) => {
  try {
    let { password } = req.body;
    const { email } = req.body;
    const duplicateUser = await User.findOne({ email });

    //test for duplicate users
    if (duplicateUser) {
      return res.status().json({
        status: 400,
        message: "User already exists!",
        requestAt: new Date().toLocaleString(),
      });
    }

    //hash password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      password = hash;
    });

    const newUserData = {
      email,
      password,
    };

    const newUserProfile = await User.create({ newUserData });
    const token = jwt.createToken(newUserProfile);

    return res.status(201).json({
      status: 201,
      token,
      message: "New user created, booyah!",
      requestAt: new Date().toLocaleString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      requestAt: new Date().toLocaleString(),
    });
  }
};

/* NOTE Login */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //test for empty credential input
    if (email === "" || password === "") {
      throw "emptyForm";
    }

    const foundUser = await db.User.findOne({ email });

    //test if user/email does NOT exist in the database
    if (!foundUser) {
      throw "invalidUser";
    }

    //test if user's password matches what's in the database
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (isMatch) {
      const signedJwt = jwt.createToken(foundUser);

      return res.status(200).json({
        status: 200,
        message: "Success",
        signedJwt,
      });
    }
  } catch (error) {
    if (error === "emptyForm") {
      return res.status(400).json({
        status: 400,
        message: "Email and/or password can not be empty.",
      });
    }

    if (error === "invalidUser") {
      return res.status(400).json({
        status: 400,
        message: "This user/email not found.",
      });
    }

    console.log(error);
  }
};

const authCtrl = {
  create,
  login,
};

module.exports = authCtrl;
