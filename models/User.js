const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  //email - < need email validator
  email: {
    type: String,
    required: true,
  },

  password: { type: String, required: true, minLength: 5, maxLength: 15 },

  //may need to take img string and split[,][1] witbh type base64 as per mongoose
  avatar: {
    name: String,
    image: Buffer,
  },

  likedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  dislikedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  blacklistEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
