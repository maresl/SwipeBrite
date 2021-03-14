const express = require('express');
const router = express.Router();

const eventsCtrl = require('../controllers/events')


// User Routes
router.get('/new', eventsCtrl.newEvents);

module.exports = router;