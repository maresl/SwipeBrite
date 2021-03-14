const User = require('../models/User')
const bcrypt = require('bcrypt')

const create = async ( req, res ) => {
    try {
      
      let {password} = req.body
      const {email, avatar, likedEvents, dislikedEvents, blacklistEvents} = req.body
      const duplicateUser = await User.findOne({email})

      //test for duplicate users
      if(duplicateUser) {
          return res.status().json({
              status: 400,
              duplicateUser,
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
        avatar, 
        likedEvents, 
        dislikedEvents, 
        blacklistEvents
      }

      const newUserProfile = await User.create({newUserData});

      return res.status(201).json({
        status: 201,
        newUserProfile,
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