const express = require("express");
const router = express.Router();

const eventsCtrl = require("../controllers/events");
const {authenticateJWT, optionalAuthenticateJWT} = require("../auth/auth");

// Event Routes
router.post("/new", optionalAuthenticateJWT, eventsCtrl.newEvents);
router.get("/liked", authenticateJWT, eventsCtrl.showLikedEvents); // only authenticated user can see the list of their liked events

module.exports = router;
