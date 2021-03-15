const db = require("../config/database");
const mongoose = require("mongoose");
const filter = require("./utils/filterDecisionToUserArray").filter;
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

    /*
    Assuming the route is going to look sometihng like "/user/:id/updateUserEventPreferences"
    */
    //added this util fcn just in case what we get does not match what we expect.

    //$addToSet works on arrays, and if the user decision didnt exist in our db it would create it.
    const filteredDecision = filter(req.body.decision);

    const toBeUpdated = filteredDecision
      ? await db.User.findByIdAndUpdate(req.params.id, {
          $addToSet: {
            //Filter from our utils
            [filteredDecision]: req.body.eventID,
          },
          $position: 0,
          new: true,
        })
      : false;

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
