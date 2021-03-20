function filter(decision) {
  var arrays = {
    liked: "likedEvents",
    disliked: "dislikedEvents",
    blacklisted: "blacklistEvents",
    default: false,
  };
  return arrays[decision] || arrays["default"];
}

module.exports = filter;
