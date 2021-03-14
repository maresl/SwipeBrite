const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('../auth/jwt')

const create = async ( req, res ) => {
    try {
      
      let {password} = req.body
      const {email, avatar} = req.body
      const duplicateUser = await User.findOne({email})

      //test for duplicate users
      if(duplicateUser) {
          return res.status().json({
              status: 400,
              message: "User already exists!",
              requestAt: new Date().toLocaleString()
          })
      }

      //hash password
      const saltRounds = 10
      bcrypt.hash(password, saltRounds, function(err, hash) {
        password = hash
      })

      const newUserData = {
        email, 
        password,
        avatar
      }

      const newUserProfile = await User.create({newUserData});
      const token = jwt.createToken(newUserProfile)

      return res.status(201).json({
        status: 201,
        token,
        message: "New user created, booyah!",
        requestAt: new Date().toLocaleString()
      });
  
    } catch (error) {
      return res.status(500).json({
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