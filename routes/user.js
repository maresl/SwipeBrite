const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const { authenticateJWT } = require("../auth/auth");

// User Routes
router.put("/update", authenticateJWT, userCtrl.updateUserEventPreferences);
router.get("/profile", authenticateJWT, userCtrl.profile);
router.put("/updateUser", authenticateJWT, userCtrl.updateUser);

module.exports = router;
