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
const updateUserData = async (req, res) => {
  try {
    const foundUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 200,
      requestedAt: new Date().toLocaleString(),
      foundUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error,
      requestAt: new Date().toLocaleString(),
    });
  }
};
const profile = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);
    // console.log(
    //   "🚀 ~ file: user.js ~ line 14 ~ profile ~ foundUser",
    //   foundUser
    // );
    // console.log(
    //   "🚀 ~ file: user.js ~ line 17 ~ profile ~ req.user.id",
    //   req.user.id
    // );

    res.status(200).json({
      status: 200,
      requestedAt: new Date().toLocaleString(),
      foundUser,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
      requestAt: new Date().toLocaleString(),
    });
  }
};

const updateUserEventPreferences = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);

    let existingEvent = await Event.findOne({
      eventID: req.body.eventID,
    });

    const filteredDecision = filter(req.body.decision);

    if (filteredDecision) {

      if (foundUser.eventQueue.indexOf(existingEvent._id) !== -1) {
        foundUser.eventQueue.splice(
          foundUser.eventQueue.indexOf(existingEvent._id),
          1
        );
      }
      if (foundUser.likedEvents.indexOf(existingEvent._id) !== -1) {
        foundUser.likedEvents.splice(
          foundUser.likedEvents.indexOf(existingEvent._id),
          1
        );
      }
      foundUser[filteredDecision].push(existingEvent._id);
      await foundUser.save();
    } else {
      throw "invalidDecision";
    }

    res.status(200).json({
      status: 200,
      requestedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    if (err === "invalidDecision") {
      res.status(422).json({
        status: 422,
        message: "Unprocessable entity, invalid decision on event",
        requestAt: new Date().toLocaleString(),
      });
    } else {
      res.status(500).json({
        status: 500,
        message: err,
        requestAt: new Date().toLocaleString(),
      });
    }
  }
};

const userController = {
  updateUserEventPreferences,
  profile,
  updateUserData,
};

module.exports = userController;
