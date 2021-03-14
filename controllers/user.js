const db = require("../config/database");
const mongoose = require("mongoose");

/*
Expecting: req to contain the user ID that we are updating
Expecting: req to contain req.body.eventid --> the id that the user made a decision on
Expecting: req to contain whether they liked, disliked, or blacklisted the event in the form of a decision 
i.e. req.body.decision = blacklist, req.body.decision = liked, req.body.decision = disliked,  
*/
const updateUserEventPreferences = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.body.eventID))
      throw "Valid Event ID not passed";

    const toBeUpdated = await db.User.findByIdAndUpdate(req.params.id, {});

    res.status(200).json({
      status: 200,
      toBeUpdated,
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
