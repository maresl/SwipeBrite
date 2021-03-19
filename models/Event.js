const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  //TM API Events->id, just to have a ref to the api ID
  eventID: {
    type: String,
  },
  //TM API Events -> Price Range
  priceRange: {
    type: Number,
  },
  // TM API Events-> dates
  dates: {
    type: [Date],
    default: undefined,
  },

  //TM API Events->url
  eventURL: {
    type: String,
  },

  //TM API Events -> info
  description: {
    type: String,
  },

  //TM API Genres->name , ID is to have a reference for the api just in case .
  classifications: {
    type: String,
    id: Number,
  },

  //TM API Events->Venues model
  venue: {
    name: {
      type: String,
    }
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
