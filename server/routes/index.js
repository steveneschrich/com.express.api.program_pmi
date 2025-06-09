const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const redcapCtrl = require('../controllers/redcap');

router.post('/import', authCtrl.validateToken, redcapCtrl.import);

module.exports = router;
