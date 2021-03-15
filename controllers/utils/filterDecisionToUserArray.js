function filter(decision) {
  var arrays = {
    liked: "likedEvent",
    disliked: "dislikedEvent",
    blacklisted: "blacklistEvent",
    default: false,
  };
  return arrays[decision] || arrays["default"];
}

module.exports = filter;
