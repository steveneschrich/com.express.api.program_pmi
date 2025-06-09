const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')

router.post('/authenticate', authCtrl.auth)

module.exports = router