const User = require("../models/User.js");
const Event = require("../models/Event.js");
const mongoose = require("mongoose");
const filter = require("./utils/filterDecisionToUserArray");
/*
Expecting: req to contain the user ID that we are updating
Expecting: req to contain req.body.eventid --> the id that the user made a decision on
Expecting: req to contain whether they liked, disliked, or blacklisted the event in the form of a decision 
i.e. req.body.decision = blacklist, req.body.decision = liked, req.body.decision = disliked,  
*/
const updateUserEventPreferences = async (req, res) => {
  console.log('got into updateUserEventPreferences')
  try {
    console.log('got into try catch')
    const foundUser = await User.findById(req.user.id);

    console.log('id of the user', foundUser._id)

    let existingEvent = await Event.findOne({
      eventID: req.body.eventID,
    })

    console.log('id of the event', existingEvent._id)
    //added this util fcn just in case what we get does not match what we expect.

    //$addToSet works on arrays, and if the user decision didnt exist in our db it would create it.
    const filteredDecision = filter(req.body.decision);

    if (filteredDecision) {
      console.log(`gonna add ${existingEvent._id} to the ${filteredDecision} array now`)

      await foundUser[filteredDecision].push(existingEvent._id)
      await foundUser.save()
    }
      console.log("liked events:", foundUser.likedEvents)
      console.log("disliked events:", foundUser.dislikedEvents)
      console.log("blacklist events:", foundUser.blacklistEvents)



    res.status(200).json({
      status: 200,
      requestedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
      requestAt: new Date().toLocaleString(),
    });
  }
};

const userController = {
  updateUserEventPreferences,
};

module.exports = userController;
