const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth");
const userController = require("../controllers/user");
const userCtrl = require("../controllers/user");

// User Routes
router.post("/create", authCtrl.create);
router.post("/login", authCtrl.login);
module.exports = router;
