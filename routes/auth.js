const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth')


// User Routes
router.post('/create', authCtrl.create);
router.post('/login', authCtrl.login);

module.exports = router;