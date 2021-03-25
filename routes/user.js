const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const {authenticateJWT} = require("../auth/auth");

// User Routes
router.post("/update", authenticateJWT, userCtrl.updateUserEventPreferences);

module.exports = router;
