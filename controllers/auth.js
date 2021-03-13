const User = require('../models/User')
const bcrypt = require('bcrypt')

const create = async ( req, res ) => {
    try {
      //const events = await dbCall;

      const saltRounds = 10
      bcrypt.hash(password, saltRounds, function(err, hash) {
        password = hash
      })

      res.status(200).json({
        status: 200,
        message: "..creating a new user... please wait",
        requestAt: new Date().toLocaleString()
      });
  
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Something went wrong!",
        requestAt: new Date().toLocaleString()
      });
    };
  };

const authCtrl = {
  create,
}

module.exports = authCtrl;