const express = require('express');
const router = express.Router();

const eventsCtrl = require('../controllers/events')


// User Routes
router.get('/', eventsCtrl.index);

module.exports = router;