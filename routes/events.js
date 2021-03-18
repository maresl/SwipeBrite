const express = require("express");
const router = express.Router();

const eventsCtrl = require("../controllers/events");
const authenticateJWT = require("../auth/auth");

// Event Routes
router.get("/new", authenticateJWT, eventsCtrl.newEvents);
router.get("/liked", authenticateJWT, eventsCtrl.showLikedEvents); // only authenticated user can see the list of their liked events

module.exports = router;
