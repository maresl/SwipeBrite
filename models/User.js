const mongoose = require("mongoose");

(Schema = mongoose.Schema),
  (bcrypt = require("bcrypt")),
  (SALT_WORK_FACTOR = 10);

var UserSchema = new Schema({
  //email - < need email validator
  username: {
    type: Text,
    required: true,
    index: { unique: true },
  },

  password: { type: String, required: true, minLength: 5, maxLength: 15 },

  //may need to take img string and split[,][1] witbh type base64 as per mongoose
  avatar: {
    name: String,
    image: Buffer,
  },

  likedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
  },

  dislikedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
  },

  blacklistEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
  },
});

UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    //hashing password
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      //set password to be hash
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
