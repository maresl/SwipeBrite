const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  //TM API Events->id, just to have a ref to the api ID
  eventID: {
    type: Number,
    required: true,
  },
  //TM API Events -> Price Range
  priceRange: {
    type: Number,
    required: true,
  },
  // TM API Events-> dates
  dates: {
    type: [Date],
    required: true,
    default: undefined,
  },

  //TM API Events->url
  eventURL: {
    type: String,
    required: false,
  },

  //TM API Events -> info
  description: {
    type: String,
    required: true,
  },

  //TM API Genres->name , ID is to have a reference for the api just in case .
  classifications: {
    type: String,
    id: Number,
  },

  //TM API Events->Venues model
  venue: {
    location: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
