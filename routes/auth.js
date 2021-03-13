const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth')


// User Routes
router.get('/create', authCtrl.create);

module.exports = router;