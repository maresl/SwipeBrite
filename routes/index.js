const express = require('express');
const router = express.Router();

const indexCtrl = require('../controllers/index.js')


// User Routes
router.get('/', indexCtrl.index );

module.exports = router;