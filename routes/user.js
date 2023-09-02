const express = require('express');

const user = require('../controller/user');

const router = express.Router();

router.get('/signup',user.signup);
router.post('/signup',user.postData);

router.get('/login',user.getlogin);
router.post('/login',user.postlogin);

module.exports = router;
